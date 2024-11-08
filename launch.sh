#!/usr/bin/env bash

function select_option {
    ESC=$( printf "\033")
    cursor_blink_on()  { printf "$ESC[?25h"; }
    cursor_blink_off() { printf "$ESC[?25l"; }
    cursor_to()        { printf "$ESC[$1;${2:-1}H"; }
    print_option()     { printf "   $1 "; }
    print_selected()   { printf "  $ESC[7m $1 $ESC[27m"; }
    get_cursor_row()   { IFS=';' read -sdR -p $'\E[6n' ROW COL;
                         echo ${ROW#*[}; }
    key_input()        { read -s -n3 key 2>/dev/null >&2
                         if [[ $key = $ESC[A ]]; then echo up;    fi
                         if [[ $key = $ESC[B ]]; then echo down;  fi
                         if [[ $key = ""     ]]; then echo enter; fi; }
    for opt; do printf "\n"; done
    local lastrow=`get_cursor_row`
    local startrow=$(($lastrow - $#))
    trap "cursor_blink_on; stty echo; printf '\n'; exit" 2
    cursor_blink_off
    local selected=0
    while true; do
        local idx=0
        for opt; do
            cursor_to $(($startrow + $idx))
            if [ $idx -eq $selected ]; then
                print_selected "$opt"
            else
                print_option "$opt"
            fi
            ((idx++))
        done
        case `key_input` in
            enter) break;;
            up)    ((selected--));
                   if [ $selected -lt 0 ]; then selected=$(($# - 1)); fi;;
            down)  ((selected++));
                   if [ $selected -ge $# ]; then selected=0; fi;;
        esac
    done
    cursor_to $lastrow
    printf "\n"
    cursor_blink_on
    return $selected
}

$TERM -e npm start &
TERM_PID=$!

function quit {
  kill "$TERM_PID"
  exit
}

function create_character {
  response=$(curl 'http://localhost:3000/all' --progress-bar)

  index=0
  while curl --silent --head "http://localhost:3000/character/$index" | grep -q "200 OK"; do
    ((index++))
  done

  echo "Veuillez entrer le nom de votre personnage:"
  read character_name

  res=$(echo "$response" | jq -r '.classes[].index')
  classes=()
  while IFS= read -r line; do
    classes+=("$line")
  done <<< "$res"
  select_option "${classes[@]}"
  chosen_class=${classes[$?]}

  echo "Vous avez choisi d'être un ${chosen_class}."
  res=$(echo "$response" | jq -r --arg class "$chosen_class" '.classes[] | select(.index == $class) | .proficiency_choices[].index')
  class_proficiencies=()
  chosen_class_proficiency=""
  if [[ "$res" != "" ]]; then
    while IFS= read -r line; do
      class_proficiencies+=("$line")
    done <<< "$res"
    echo "Veuillez selectionner votre compétence optionnelle."
    select_option "${class_proficiencies[@]}"
    chosen_class_proficiency=${class_proficiencies[$?]}
  fi

  echo "Choisissez un alignement."
  res=$(echo "$response" | jq -r '.alignments[].index')
  alignments=()
  while IFS= read -r line; do
    alignments+=("$line")
  done <<< "$res"
  select_option "${alignments[@]}"
  chosen_alignment=${alignments[$?]}

  echo "Choisissez une race."
  res=$(echo "$response" | jq -r '.races[].index')
  races=()
  while IFS= read -r line; do
    races+=("$line")
  done <<< "$res"
  select_option "${races[@]}"
  chosen_race=${races[$?]}



  echo "Vous avez choisi d'être un ${chosen_race}."
  res=$(echo "$response" | jq -r --arg class "$chosen_race" '.races[] | select(.index == $class) | .starting_proficiency_options[].index')
  race_starting_proficiencies=()
  chosen_race_starting_proficiency=""
  if [[ "$res" != "" ]]; then
    while IFS= read -r line; do
      race_starting_proficiencies+=("$line")
    done <<< "$res"
    echo "Veuillez selectionner votre compétence de départ optionnelle."
    select_option "${race_starting_proficiencies[@]}"
    chosen_race_starting_proficiency=${race_starting_proficiencies[$?]}
  fi


  res=$(echo "$response" | jq -r --arg class "$chosen_race" '.races[] | select(.index == $class) | .subraces[].index')
  subraces=()
  chosen_subrace=""
  if [[ "$res" != "" ]]; then
    while IFS= read -r line; do
      subraces+=("$line")
    done <<< "$res"
    echo "Veuillez selectionner votre sous race."
    select_option "${subraces[@]}"
    chosen_subrace=${subraces[$?]}
  fi


  res=$(echo "$response" | jq -r --arg class "$chosen_race" '.races[] | select(.index == $class) | .subraces[].language_option[].index')
  languages=()
  chosen_lang=""
  if [[ "$res" != "" ]]; then
    while IFS= read -r line; do
      languages+=("$line")
    done <<< "$res"
    echo "Veuillez selectionner une langue optionelle."
    select_option "${languages[@]}"
    chosen_lang=${languages[$?]}
  fi

  echo "Récapitulation:"
  echo "index: {$index}"
  echo "nom: ${character_name}"
  echo "classe: ${chosen_class}"
  echo "classe proficiency: ${chosen_class_proficiency}"
  echo "alignement: ${chosen_alignment}"
  echo "race: ${chosen_race}"
  echo "sous-race: ${chosen_subrace}"
  echo "race proficiency: ${chosen_race_starting_proficiency}"
  echo "language option: ${chosen_lang}"

  curl -X POST http://localhost:3000/character \
    -H "Content-Type: application/json" \
    -d "{
      \"index\": \"$index\",
      \"name\": \"$character_name\",
      \"user_index\": 1,
      \"character_class\": \"$chosen_class\",
      \"prof_choice\": \"$chosen_class_proficiency\",
      \"character_alignment\": \"$chosen_alignment\",
      \"choosen_race\": \"$chosen_race\",
      \"choosen_subrace\": \"$chosen_subrace\",
      \"choosen_language\": \"$chosen_lang\"
    }"

  quit
}

function display_stored_character {
  response=$(curl -s 'http://localhost:3000/characters')
  indices=$(echo "$response" | jq '.[]')
  char_names=()
  index_array=()

  for index in $indices; do
    character_response=$(curl -s "http://localhost:3000/character/$index")
    name=$(echo "$character_response" | jq -r '.name')
    char_names+=("$name")
    index_array+=("$index")
  done

  if [[ "${#char_names[@]}" -gt 0 ]]; then
    echo "Sélectionnez un personnage à afficher."
    select_option "${char_names[@]}"
    choice_index=$?
    selected_index=${index_array[$choice_index]}
    selected_character=$(curl -s "http://localhost:3000/character/$selected_index")
    echo "$selected_character"
  fi
  quit
}


echo "Les p'tits rôlistes — Home —"
echo "Selectionnez une action."
echo

options=("Créer un personnage." "Afficher les personnages enregistrés." "Quitter")
select_option "${options[@]}"
choice=$?

case "$choice" in
  0)
    echo "Les p'tits rôlistes — Création de personnage —"
    echo
    create_character
    ;;
  1)
    echo "Les p'tits rôlistes — Afficher les personnages enregistrés —"
    echo
    display_stored_character
    ;;
  2)
    quit
    ;;
esac
