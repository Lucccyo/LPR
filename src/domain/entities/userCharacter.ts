export class UserCharacter {
  constructor(
    public index: number,
    public name: string,
    public image: string,

    public race_index: number,
    public alignment_index: number,
    public character_class_index: number,
    public user_index: number,
  ) {}

  toJSON(): object {
    return {
      index: this.index,
      name: this.name,
      image: this.image,
      race_index: this.race_index,
      alignment_index: this.alignment_index,
      character_class_index: this.character_class_index,
      user_index: this.user_index,
    };
  }
}
