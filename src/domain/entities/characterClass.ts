import { Proficiency } from "./proficiency";
import { Spell } from "./spell";

export class CharacterClass {
  constructor(
    public index: string,
    public name: string,
    public proficiencies: Proficiency[],
    public proficiency_choices: Proficiency[],
    public saving_throws: string[],
    public spellcasting_ability: string,
    public spells: Spell[],
  ) {}
}
