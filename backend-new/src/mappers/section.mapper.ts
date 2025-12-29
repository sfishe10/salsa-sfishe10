import {plainToInstance} from "class-transformer";
import {SectionDto} from "../dto/section.dto";
import {Section} from "../entities/section.entity";

export function toSectionDto(section: Section): SectionDto {
    const plainObj = {
        sectionId: section.sectionId,
        name: section.name
    };

    return plainToInstance(SectionDto, plainObj, { excludeExtraneousValues: true });
}