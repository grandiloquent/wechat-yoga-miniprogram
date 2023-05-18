(() => {
    var s = `v_class_type = coalesce(nullif((obj ->> 'class_type')::integer, 0), 4);
v_start_time = coalesce(nullif((obj ->> 'start_time')::integer, 0), 0);
v_end_time = coalesce(nullif((obj ->> 'end_time')::integer, 0), 0);
v_peoples = coalesce(nullif((obj ->> 'peoples')::bigint, 0), 0);
v_week = coalesce(nullif((obj ->> 'date_time')::integer, 0), 0);
select id into v_lesson_id from lesson where name = obj ->> 'lesson' limit 1;
if v_lesson_id = 0 then
    return -1;
end if;
select id into v_teacher_id from coach where name = obj ->> 'teacher' limit 1;`
    console.log([...s.matchAll(/(?<=->> ')[a-z_]+(?=')/g)]
    .map(x=>`let ${x[0]} = this.data.${x[0]}s[this.data.${x[0]}SelectedIndex];`).join('\n'));
    console.log([...s.matchAll(/(?<=->> ')[a-z_]+(?=')/g)]
    .map(x=>`${x[0]}`).join(',\n'));
})();