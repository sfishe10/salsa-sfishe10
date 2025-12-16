import {db} from "../config/data-source";
import {EventAttendance} from "../entities/event-attendance.entity";
import {plainToInstance} from "class-transformer";
import {MemberStatsDto} from "../dto/member-stats.dto";

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

    // might not need if this can just get attached to Member
    public async findByMemberId(id: number): Promise<EventAttendance[]> {
        return await this.repo.find({ where: { member: { memberId: id } },
            relations: {
                mbEvent: true,
                member: true,
                sub: true,
                section: true,
            }
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

    public async create(attendance: Partial<EventAttendance>) {
        const newAttendance = this.repo.create(attendance);
        return await this.repo.save(newAttendance);
    }

}