import { Mastery } from "./mastery";
import { Language } from "./language";
import { Trait } from "./trait";
import { Bonus } from "./bonus";
import { SubSpecies } from "./subSpecies";

export class Species {
  constructor(
    public id: string,
    public name: string,
    public height: number,
    public base_masteries: Mastery[],
    public bonus_masteries: Mastery[],
    public base_languages: Language[],
    public bonus_language: Language[],
    public base_traits: Trait[],
    public bonus: Bonus[],
    public subSpecies?: SubSpecies,
  ) {}
}