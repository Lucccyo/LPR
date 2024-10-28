export class UserCharacter {
  constructor(
    public index: number,
    public name: string,
    public user_index: string,
    public character_class_index: string,
  ) {}

  toJSON(): object {
    return {
      index: this.index,
      name: this.name,
      user_index: this.user_index,
      character_class_index: this.character_class_index,
    };
  }
}
