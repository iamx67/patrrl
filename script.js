document.getElementById('submitParticipants').addEventListener('click', () => {
    const input = document.getElementById('participants').value.trim();
    if (!input) return;

    // Обработка участников с поддержкой имен из нескольких слов и устранение дубликатов
    const participants = Array.from(new Set(input.split(',').map(name => name.trim()).filter(name => name)));

    if (participants.length === 0) {
        alert('Введите корректный список участников.');
        return;
    }

    const participantListDiv = document.getElementById('participantList');
    participantListDiv.innerHTML = '';

    participants.forEach(name => {
        const div = document.createElement('div');
        div.textContent = name;
        div.classList.add('participant');
        div.addEventListener('click', () => {
            if (div.classList.contains('leader')) {
                div.classList.remove('leader');
            } else if (div.classList.contains('responsible')) {
                div.classList.remove('responsible');
            } else if (document.querySelectorAll('.leader').length < 2) {
                div.classList.add('leader');
            } else {
                div.classList.add('responsible');
            }
        });
        participantListDiv.appendChild(div);
    });

    document.getElementById('selectLeadersAndResponsibles').classList.remove('hidden');
    document.getElementById('assemblePatrol').classList.remove('hidden');
});

document.getElementById('assemblePatrol').addEventListener('click', () => {
    const leaders = Array.from(document.querySelectorAll('.leader')).map(el => el.textContent);
    const responsibles = Array.from(document.querySelectorAll('.responsible')).map(el => el.textContent);
    const participants = Array.from(document.querySelectorAll('.participant:not(.leader):not(.responsible)'))
        .map(el => el.textContent);

    if (leaders.length !== 2) {
        alert('Выберите двух ведущих.');
        return;
    }

    // Разделение участников на две группы с учетом ответственных
    const halfIndex = Math.ceil(participants.length / 2);
    const group1 = participants.slice(0, halfIndex);
    const group2 = participants.slice(halfIndex);

    // Распределение ответственных по группам
    responsibles.forEach((responsible, index) => {
        if (index % 2 === 0) {
            group1.push(responsible);
        } else {
            group2.push(responsible);
        }
    });

    const patrolOutput = document.getElementById('patrolResult');
    patrolOutput.textContent = `[1] Ведёт: ${leaders[0]}. Участники: ${group1.join(', ')}.\n[2] Ведёт: ${leaders[1]}. Участники: ${group2.join(', ')}.`;

    document.getElementById('patrolOutput').classList.remove('hidden');
});

document.getElementById('createReport').addEventListener('click', () => {
    document.getElementById('reportOutput').classList.remove('hidden');
});

document.getElementById('generateReport').addEventListener('click', () => {
    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString().slice(-2)}`;
    const timeOfDay = document.getElementById('timeOfDay').value;

    const leaders = Array.from(document.querySelectorAll('.leader')).map(el => el.textContent);
    const groups = document.getElementById('patrolResult').textContent.split('\n');

    let report = `[[b]i[/b]]${formattedDate}[[b]/i[/b]]\n[[b]b[/b]]${timeOfDay}[[b]/b[/b]]. `;
    report += groups.map((line, index) => {
        const leader = leaders[index];
        const suffix = (/[ая]$/.test(leader) ? 'вела' : 'вел');
        return line.replace(/Ведёт: .*?\./, `${suffix.charAt(0).toUpperCase() + suffix.slice(1)}: ${leader}.`);
    }).join(' ');

    document.getElementById('reportResult').textContent = report;
});