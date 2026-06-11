insert into Station values (NULL, "Stationary Basics", NULL, 0, 0, 0);
insert into Station values (NULL, "Stationary Basics, Part 2", NULL, 0, 1, 0);
insert into Station values (NULL, "Beginnings of Movement", NULL, 0, 2, 0);
insert into Station values (NULL, "Directions of Movement", NULL, 0, 3, 0);
insert into Station values (NULL, "Intermediate Marching Technique", NULL, 0, 4, 0);
insert into Station values (NULL, "Advanced Marching Technique", NULL, 0, 5, 0);

insert into StationGroup values (NULL, 1, "Relax", 0);
insert into StationGroup values (NULL, 1, "Attention", 1);
insert into StationGroup values (NULL, 1, "Parade Rest", 2);
insert into StationGroup values (NULL, 1, "Called Horns Up", 3);
insert into StationGroup values (NULL, 1, "Visual Horns Up", 4);
insert into StationGroup values (NULL, 1, "Visual Horns Down", 5);
insert into StationGroup values (NULL, 1, "Slow Horns Up", 6);
insert into StationGroup values (NULL, 1, "Slow Horns Down", 7);
insert into StationGroup values (NULL, 1, "Kick Down Up", 8);
insert into StationGroup values (NULL, 1, "Carry Position", 9);

insert into StationGroup values (NULL, 2, "Left Face", 0);
insert into StationGroup values (NULL, 2, "Right Face", 1);
insert into StationGroup values (NULL, 2, "About Face", 2);
insert into StationGroup values (NULL, 2, "Mark Time", 3);
insert into StationGroup values (NULL, 2, "Halt", 4);
insert into StationGroup values (NULL, 2, "Slow Turn Left", 5);
insert into StationGroup values (NULL, 2, "Slow Turn Right ", 6);

insert into StationGroup values (NULL, 3, "Forward March", 0);
insert into StationGroup values (NULL, 3, "Left Flank", 1);
insert into StationGroup values (NULL, 3, "Right Flank", 2);
insert into StationGroup values (NULL, 3, "To The Rear", 3);
insert into StationGroup values (NULL, 3, "Halt", 4);

insert into StationGroup values (NULL, 4, "Backward March", 0);
insert into StationGroup values (NULL, 4, "Front-To-Back", 1);
insert into StationGroup values (NULL, 4, "Back-To-Front", 2);
insert into StationGroup values (NULL, 4, "Adjusted Step Size", 3);

insert into StationGroup values (NULL, 5, "Forward Left Slide", 0);
insert into StationGroup values (NULL, 5, "Backward Left Slide", 1);
insert into StationGroup values (NULL, 5, "Forward Right Slide", 2);
insert into StationGroup values (NULL, 5, "Backward Right Slide", 3);
insert into StationGroup values (NULL, 5, "Halt", 4);

insert into StationGroup values (NULL, 6, "Cal Poly Attention", 0);
insert into StationGroup values (NULL, 6, "Cal Poly High Step Mark Time", 1);
insert into StationGroup values (NULL, 6, "Cal Poly High Step Forward March", 2);
insert into StationGroup values (NULL, 6, "Run On", 3);


INSERT INTO StationItem (itemID, groupID, item, level, required)
VALUES
    (NULL, 44, 'Right arch on dot', 0, 1),
    (NULL, 45, 'Executed in Time', 0, 1),
    (NULL, 45, 'Verbal Clear and Loud', 1, 1),
    (NULL, 45, 'Heels Together', 2, 1),
    (NULL, 45, 'Toes Apart (45 degrees)', 3, 1),
    (NULL, 45, 'Knees Not Locked', 4, 1),
    (NULL, 45, 'Hips Centered', 5, 1),
    (NULL, 45, 'Arms Comfortably Bent', 6, 1),
    (NULL, 45, 'Relaxed Fists At Side', 7, 1),
    (NULL, 45, 'Eyes Above Horizon', 8, 1),
    (NULL, 46, 'Executed in Time', 0, 1),
    (NULL, 46, 'Verbal Loud and Clear', 1, 1),
    (NULL, 46, 'Right Foot on Dot', 2, 1),
    (NULL, 46, 'Left Foot Moves To Shoulder Width Apart', 3, 1),
    (NULL, 46, 'Hands clasped in Front, left over right', 4, 1),
    (NULL, 47, 'Executed in Time', 0, 1),
    (NULL, 47, 'Verbal Clear and Loud', 1, 1),
    (NULL, 47, 'Correct Horn Angle or left hand on top of right fist', 2, 1),
    (NULL, 47, 'Elbows not collapsed or flayed out', 3, 1),
    (NULL, 48, 'Executed in Time', 0, 1),
    (NULL, 48, 'Back to Attention Position', 1, 1),
    (NULL, 49, 'Executed in Time with Verbal', 0, 1),
    (NULL, 49, 'Correct Horn Angle', 1, 1),
    (NULL, 50, 'Executed in Time with Lead', 0, 1),
    (NULL, 50, 'Correct Horn Angle', 1, 1),
    (NULL, 51, 'Executed in Time with Lead', 0, 1),
    (NULL, 51, 'Back in Attention Position', 1, 1),
    (NULL, 52, 'Executed in Time with Verbal', 0, 1),
    (NULL, 52, 'Right foot kicks out diagonally, knee straight', 1, 1),
    (NULL, 52, 'Correct Horn Angle', 2, 1),
    (NULL, 53, 'Horn placement correct', 0, 1);


INSERT INTO StationItem (itemID, groupID, item, level, required)
VALUES
    (NULL, 19, 'Executed in Time with Verbal', 0, 1),
    (NULL, 19, 'Clean Pivot', 1, 1),
    (NULL, 19, 'Returned to Attention Position', 2, 1),
    (NULL, 20, 'Executed in Time with Verbal', 0, 1),
    (NULL, 20, 'Clean Pivot', 1, 1),
    (NULL, 20, 'Returned to Attention Position', 2, 1),
    (NULL, 21, 'Executed in Time with Verbal', 0, 1),
    (NULL, 21, 'Clean Pivot', 1, 1),
    (NULL, 21, 'Returned to Attention Position', 2, 1),
    (NULL, 22, 'Executed in Time with Verbal', 0, 1),
    (NULL, 22, 'Feet Parallel', 1, 1),
    (NULL, 22, 'Toes and platforms on the ground entire time except for the initiation', 2, 1),
    (NULL, 22, 'Heels come up to ankle bone (DL Exempt)', 3, 1),
    (NULL, 23, 'Executed in Time with Verbal', 0, 1),
    (NULL, 23, 'Feet back at 45 degree angle', 1, 1),
    (NULL, 23, 'Returned to Attention Position', 2, 1),
    (NULL, 24, 'Executed in time', 0, 1),
    (NULL, 24, 'Feet in Low Mark Time', 1, 1),
    (NULL, 24, 'Rotated to correct position', 2, 1),
    (NULL, 24, 'Returned to Attention position', 3, 1),
    (NULL, 25, 'Executed in time', 0, 1),
    (NULL, 25, 'Feet in Low Mark Time', 1, 1),
    (NULL, 25, 'Rotated to correct position', 2, 1),
    (NULL, 25, 'Returned to Attention position', 3, 1);

INSERT INTO StationItem (itemID, groupID, item, level, required)
VALUES
    (NULL, 26, 'Horn Up on 1 with Verbal', 0, 1),
    (NULL, 26, 'Feet in Time for Duration', 1, 1),
    (NULL, 26, 'Glide Step Clean', 2, 1),
    (NULL, 26, 'Arches hit yard lines', 3, 1),
    (NULL, 26, 'Consistent Step Size', 4, 1),

    (NULL, 27, 'Executed in Time with Verbal', 0, 1),
    (NULL, 27, 'Clean Pivot on “and”', 1, 1),
    (NULL, 27, 'Quick Snappy Motion', 2, 1),
    (NULL, 27, 'Body Stable Throughout, left leg doesn’t swing out, no cheat step', 3, 1),

    (NULL, 28, 'Executed in Time with Verbal', 0, 1),
    (NULL, 28, 'Clean Pivot on “and”', 1, 1),
    (NULL, 28, 'Quick Snappy Motion', 2, 1),
    (NULL, 28, 'Body Stable Throughout, left leg doesn’t swing out, no cheat step', 3, 1),

    (NULL, 29, 'Executed in Time with Verbal', 0, 1),
    (NULL, 29, 'Clean Pivot on “and”, left foot replants', 1, 1),
    (NULL, 29, 'Quick Snappy Motion', 2, 1),
    (NULL, 29, 'Body Stable Throughout, no cheat step', 3, 1),

    (NULL, 30, 'Executed in Time with Verbal', 0, 1),
    (NULL, 30, 'Returned to Attention', 1, 1),
    (NULL, 30, 'Horn Down (if stated)', 2, 1);

INSERT INTO StationItem (itemID, groupID, item, level, required)
VALUES
    (NULL, 31, 'Horn Up on 1 with Verbal', 0, 1),
    (NULL, 31, 'Feet in Time for Duration', 1, 1),
    (NULL, 31, 'Up on Platform', 2, 1),
    (NULL, 31, 'Arches hit yard lines', 3, 1),
    (NULL, 31, 'Body Stable throughout', 4, 1),
    (NULL, 31, 'Step Size Consistent', 5, 1),

    (NULL, 32, 'Rolled through foot', 0, 1),
    (NULL, 32, 'Up on Platforms, left foot replanted', 1, 1),
    (NULL, 32, 'Clear pause (deadbeat)', 2, 1),
    (NULL, 32, 'Body Stable throughout', 3, 1),

    (NULL, 33, 'Rolled back down to full foot, left foot replanted', 0, 1),
    (NULL, 33, 'Clear pause (deadbeat)', 1, 1),
    (NULL, 33, 'Body Stable throughout', 2, 1),
    (NULL, 33, 'Ended maneuver on correct yard line/splitting', 3, 1),

    (NULL, 34, 'Executed in Time', 0, 1),
    (NULL, 34, 'Consistent Step Size', 1, 1),
    (NULL, 34, 'Body Stable Throughout', 2, 1),
    (NULL, 34, '12-5 is a step (not a shuffle)', 3, 1);

INSERT INTO StationItem (itemID, groupID, item, level, required)
VALUES
    (NULL, 35, 'Upper Body and Hips rotated', 0, 1),
    (NULL, 35, 'Clean pivot with verbal', 1, 1),
    (NULL, 35, 'Executed in time', 2, 1),
    (NULL, 35, 'Correct step size', 3, 1),
    (NULL, 35, 'Body stable throughout', 4, 1),
    (NULL, 35, 'Marched Straight (No Drift)', 5, 1),

    (NULL, 36, 'Correct Step Size', 0, 1),
    (NULL, 36, 'Clean pivot with verbal', 1, 1),
    (NULL, 36, 'Executed in time', 2, 1),
    (NULL, 36, 'Upper Body and Hips rotated', 3, 1),
    (NULL, 36, 'Body stable throughout', 4, 1),
    (NULL, 36, 'Marched Straight (No Drift)', 5, 1),

    (NULL, 37, 'Correct step size', 0, 1),
    (NULL, 37, 'Clean pivot with verbal', 1, 1),
    (NULL, 37, 'Executed in time', 2, 1),
    (NULL, 37, 'Upper Body and Hips rotated', 3, 1),
    (NULL, 37, 'Body stable throughout', 4, 1),
    (NULL, 37, 'Marched Straight (No Drift)', 5, 1),

    (NULL, 38, 'Correct step size', 0, 1),
    (NULL, 38, 'Clean pivot with verbal', 1, 1),
    (NULL, 38, 'Executed in time', 2, 1),
    (NULL, 38, 'Upper Body and Hips rotated', 3, 1),
    (NULL, 38, 'Body stable throughout', 4, 1),
    (NULL, 38, 'Marched Straight (No Drift)', 5, 1),

    (NULL, 39, 'Executed in Time', 0, 1),
    (NULL, 39, 'Verbal Clear (“Step and Close”)', 1, 1),
    (NULL, 39, 'Returned to Attention', 2, 1),
    (NULL, 39, 'Horn Down (if stated)', 3, 1);


INSERT INTO StationItem (itemID, groupID, item, level, required)
VALUES
    (NULL, 40, 'Verbal loud and clear (“1-2-3”) (Band Ten Hut)', 0, 1),
    (NULL, 40, 'Executed in Time with Tempo', 1, 1),
    (NULL, 40, 'Knees at proper angle', 2, 1),
    (NULL, 40, 'Thigh parallel to ground', 3, 1),
    (NULL, 40, 'Toes pointed with leg', 4, 1),
    (NULL, 40, 'Core Stable Throughout', 5, 1),

    (NULL, 41, 'Verbal loud on prep (“Up”) (Band Mark time mark)', 0, 1),
    (NULL, 41, 'Executed in Time with Tempo', 1, 1),
    (NULL, 41, 'Knees at proper angle', 2, 1),
    (NULL, 41, 'Thigh parallel to ground', 3, 1),
    (NULL, 41, 'Toes pointed with leg', 4, 1),
    (NULL, 41, 'Core Stable Throughout', 5, 1),
    (NULL, 41, 'Verbal Halt (“Step and Close”)', 6, 1),

    (NULL, 42, 'Verbal loud and clear on prep', 0, 1),
    (NULL, 42, 'Correct step size', 1, 1),
    (NULL, 42, 'Executed in Time with Tempo', 2, 1),
    (NULL, 42, 'Body stable throughout', 3, 1),
    (NULL, 42, 'Verbal Halt (“Step and Close”)', 4, 1),

    (NULL, 43, 'Verbal clear on Prep (“Up”)', 0, 1),
    (NULL, 43, 'Prep step executed', 1, 1),
    (NULL, 43, 'Executed in Time with Tempo', 2, 1),
    (NULL, 43, 'Verbal clear (“Kick-Down-up”)', 3, 1),
    (NULL, 43, 'Thigh parallel to ground', 4, 1),
    (NULL, 43, 'Knees at proper angle', 5, 1),
    (NULL, 43, 'Body stable throughout', 6, 1);
