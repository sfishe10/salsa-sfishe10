import {db} from "../config/data-source";
import {EventAttendance} from "../entities/event-attendance.entity";
import {plainToInstance} from "class-transformer";
import {MemberStatsDto} from "../dto/member-stats.dto";
import {AttendanceTermPageDto} from "../dto/attendance-term-page.dto";

export class AttendanceRepository {
    private repo = db.getRepository(EventAttendance);

    public async findById(id: number): Promise<EventAttendance | null> {
        return await this.repo.findOne({ where: { attendanceId: id },
            relations: {
                mbEvent: true,
                member: true,
                sub: true,
                section: true,
            }
        });
    }

    public async findByMemberId(id: number): Promise<EventAttendance[]> {
        return await this.repo.find({
            where: { member: { memberId: id } },
            // relations: {
            //     mbEvent: true,
            //     member: true,
            //     sub: true,
            //     section: true,
            // }
        });
    }

    public async findBySectionAndEventId(sectionId: number, eventId: number): Promise<EventAttendance[]> {
        return await this.repo.find({
            where: {
                section: { sectionId },
                mbEvent: { eventId }
            },
            relations: {
                mbEvent: true,
                member: true,
                sub: true,
                section: true,
            }
        });
    }

    public async getByTermIdAndSection(
            termId: number,
            sectionId: number | null,
            eventType: string): Promise<AttendanceTermPageDto[]> {

        const params: any[] = [termId, eventType];
        let sectionClause = '';

        if (sectionId !== null) {
            sectionClause = 'AND s.sectionId = ?';
            params.push(sectionId);
        }

        const sql = `
              SELECT
                ea.attendanceId,
                ea.attendance AS attendanceStatus,
                e.eventId,
                e.title AS eventTitle,
                e.date AS eventDate,
                mem.memberId,
                u.firstName AS memberFirstName,
                u.lastName AS memberLastName,
                mem.rehearsalConflict,
                sub.memberId AS subId,
                sub_u.firstName AS subFirstName,
                sub_u.lastName AS subLastName,
                s.sectionId,
                s.name AS sectionName
              FROM EventAttendance ea
              JOIN MBEvent e ON ea.eventId = e.eventId
              JOIN Member mem ON ea.memberId = mem.memberId
              JOIN User u ON mem.email = u.email
              LEFT JOIN Member sub ON ea.subId = sub.memberId
              LEFT JOIN User sub_u ON sub.email = sub_u.email
              JOIN Section s ON mem.sectionId = s.sectionId
              WHERE e.termId = ?
                AND e.type = ?
                ${sectionClause}
              ORDER BY s.sectionId, e.date, u.lastName
        `;

        const results: any[] = await db.query(sql, params);

        return plainToInstance(AttendanceTermPageDto, results, {
            excludeExtraneousValues: true,
        });
    }

    public async getByTermIdAndSectionAndPepBand(
            termId: number,
            pepBandId: number,
            sectionId: number | null,
            ignoreMemberPepBand: boolean): Promise<AttendanceTermPageDto[]> {
        const params: any[] = [termId, pepBandId];
        let pepBandClause = '';
        let sectionClause = '';

        if (!ignoreMemberPepBand) {
            pepBandClause = 'AND mem.pepBandId = ? ';
            params.push(pepBandId);
        }

        if (sectionId !== null) {
            sectionClause = 'AND s.sectionId = ? ';
            params.push(sectionId);
        }

        const sql = `
            SELECT
              ea.attendanceId,
              ea.attendance AS attendanceStatus,
              e.eventId,
              e.title AS eventTitle,
              e.date AS eventDate,
              mem.memberId,
              u.firstName AS memberFirstName,
              u.lastName AS memberLastName,
              mem.rehearsalConflict,
              sub.memberId AS subId,
              sub_u.firstName AS subFirstName,
              sub_u.lastName AS subLastName,
              s.sectionId,
              s.name AS sectionName
            FROM EventAttendance ea
            JOIN MBEvent e ON ea.eventId = e.eventId
            JOIN Member mem ON ea.memberId = mem.memberId
            JOIN User u ON mem.email = u.email
            LEFT JOIN Member sub ON ea.subId = sub.memberId
            LEFT JOIN User sub_u ON sub.email = sub_u.email
            JOIN Section s ON mem.sectionId = s.sectionId
            WHERE e.termId = ?
              AND e.pepBandId = ?
              ${pepBandClause}
              ${sectionClause}
            ORDER BY s.sectionId, e.date, u.lastName
        `;

        const results: any[] = await db.query(sql, params);

        return plainToInstance(AttendanceTermPageDto, results, {
            excludeExtraneousValues: true,
        });
    }


    public async getMemberStatsBySectionId(sectionId: number): Promise<MemberStatsDto> {
        const sql =
            'SELECT\n' +
            '      m.memberId,\n' +
            '      m.termId,\n' +
            '      m.email,\n' +
            '      u.firstName,\n' +
            '      u.lastName,\n' +
            '      COUNT(CASE WHEN \n' +
            '          m.memberId = ea.memberId AND e.type = \'Rehearsal\' AND ea.attendance NOT LIKE \'%Absent%\'\n' +
            '        THEN 1 END) AS numRehearsals,\n' +
            '      COUNT(CASE WHEN \n' +
            '          m.memberId = ea.memberId AND e.type = \'Whole Band Event\' AND ea.attendance NOT LIKE \'%Absent%\'\n' +
            '        THEN 1 END) AS numWholeBandEvents,\n' +
            '      COUNT(CASE WHEN \n' +
            '          m.memberId = ea.memberId AND e.type = \'Pep Event\' AND ea.attendance NOT LIKE \'%Absent%\' AND ea.attendance NOT LIKE \'%Sub%\'\n' +
            '        THEN 1 END) AS numPepEvents,\n' +
            '      COUNT(CASE WHEN \n' +
            // TODO: fix this bug - 'volunteer' is a pep band, not event type
            '          m.memberId = ea.memberId AND e.type = \'Volunteer\' AND ea.attendance NOT LIKE \'%Absent%\'\n' +
            '        THEN 1 END) AS numVolunteerEvents,\n' +
            '      COUNT(CASE WHEN ea.subId = m.memberId THEN 1 END) AS numSubEvents\n' +
            'FROM Member m\n' +
            '    LEFT JOIN User u ON m.email = u.email\n' +
            '    LEFT JOIN EventAttendance ea ON (m.memberId = ea.memberId OR m.memberId = ea.subId)\n' +
            '    LEFT JOIN MBEvent e ON ea.eventId = e.eventId\n' +
            '    LEFT JOIN Term t ON m.termId = t.termId\n' +
            'WHERE t.startDate <= NOW() AND t.endDate >= NOW()\n' +
            '      AND m.sectionId = ?\n' +
            'GROUP BY m.memberId\n' +
            'ORDER BY u.lastName';

        const results = await db.query(sql, [sectionId]);

        const stats = plainToInstance(MemberStatsDto, results, {
            excludeExtraneousValues: true,
        });

        return stats;
    }

    public async save(attendance: Partial<EventAttendance>): Promise<EventAttendance> {
        return this.repo.save(attendance);

    }

    public async delete(attendanceId: number): Promise<void> {
        await this.repo.delete(attendanceId);
    }

    public async findByEventId(eventId: number): Promise<EventAttendance[]> {
        return await this.repo.find({
            where: {
                mbEvent: { eventId }
            }
        });
    }

    public async deleteAttendancesForEvent(eventId: number): Promise<void> {
        const attendances = await this.findByEventId(eventId);

        attendances.forEach(att => this.delete(att.attendanceId));
    }

    public async deleteAttendancesForMember(memberId: number): Promise<void> {
        const attendances = await this.findByMemberId(memberId);

        attendances.forEach(att => this.delete(att.attendanceId));
    }

}