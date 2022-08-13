function createLessonHistory(count, lessonName) {
    const div = document.createElement('div');
    div.setAttribute("class", "item");
    document.body.appendChild(div);
    const div1 = document.createElement('div');
    div.appendChild(div1);
    div1.textContent = count;
    const div2 = document.createElement('div');
    div.appendChild(div2);
    div2.textContent = lessonName;
    return div;
}

const lessonHistory = document.getElementById('lesson-history');
[
    { count: 0, lessonName: '团课' },
    { count: 0, lessonName: '私教' },
    { count: 0, lessonName: '小班' },
].forEach(x => {
    lessonHistory.appendChild(createLessonHistory(x.count, x.lessonName));
});
document.getElementById('user').addEventListener('click', evt => {
    window.location = '/profile';
})