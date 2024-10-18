import { ApiRepository, FetchReturn } from "../../domain/repositories/ApiRepository";
import { Adapter } from "../../infrastructure/Adapter";
import { Alignment } from "../../domain/entities/alignment";
import { Specie } from "../../domain/entities/specie";
import { CharacterClass } from "../../domain/entities/characterClass";

export class DndApiRepository implements ApiRepository {
    private readonly alignment_url = "https://www.dnd5eapi.co/api/alignments";
    private readonly adapter: Adapter = new Adapter();

    public async loadAlignments(): Promise<Response> {
        const response = await fetch(this.alignment_url);
        return response;
    }

    public async loadClasses(): Promise<Response> {
        const response = await fetch("https://www.dnd5eapi.co/api/classes");
        return response;
    }

    public async loadSpecies(): Promise<Response> {
        const response = await fetch("https://www.dnd5eapi.co/api/species");
        return response;
    }

    public async getAlignments(): Promise<Alignment[]> {
        const json_data = await this.loadAlignments();
        const alignments = this.adapter.deserializeAlignment(json_data);
        return alignments;
    }

    public async getClasses(): Promise<CharacterClass[]> {
        // const json_data = this.loadClasses();
        // call adapter here
        return [];
    }

    public async getSpecies(): Promise<Specie[]> {
        // const json_data = this.loadSpecies();
        // call adapter here
        return [];
    }

    public async getAll(): Promise<FetchReturn> {
        const [classes, alignments, species] = await Promise.all([
            this.getClasses(),
            this.getAlignments(),
            this.getSpecies()
        ]);
        return {
            classes,
            alignments,
            species
        };
    }
}
