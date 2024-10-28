import { Proficiency } from "./proficiency";
import { Language } from "./language";
import { Trait } from "./trait";
import { AbilityBonus } from "./abilityBonus";
import { Subrace } from "./subrace";

export class Race {
  constructor(
    public index: string,
    public name: string,
    public size: number,
    public starting_proficiencies: Proficiency[],
    public starting_proficiency_choices: Proficiency[],
    public languages: Language[],
    public traits: Trait[],
    public ability_bonuses: AbilityBonus[],
    public subraces: Subrace[],
  ) {}
}
