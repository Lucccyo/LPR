import { CharacterClass } from "./characterClass"
import { Race } from "./race"

export class UserCharacter {
  constructor(
    public index: number,
    public name: string,
    public user_index: string,
    public character_class: CharacterClass,
    public character_alignment: string,
    public choosen_race: Race,
  ) {}

  private static serialize(obj: any): any {
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(UserCharacter.serialize);

    const serializedObject: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        serializedObject[key] = UserCharacter.serialize(obj[key]);
      }
    }
    return serializedObject;
  }

  toJSON(): object {
    return UserCharacter.serialize(this);
  }
}
