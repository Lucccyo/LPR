import { Mastery } from "./mastery";
import { Spell } from "./spell";

export class CharacterClass {
  constructor(
    public index: string,
    public name: string,
    public base_masteries: Mastery[],
    public bonus_masteries: Mastery[],
    public save_throws: string,
    public spell_characteristics: string,
    public base_spells: Spell[],
  ) {}
}
