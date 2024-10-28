import { Language } from "./language";

export class Subrace {
  constructor(
    public index: string,
    public name: string,
    public language_option: Language[],
  ) {}
}
