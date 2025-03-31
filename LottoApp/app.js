let messageContainer = document.createElement('div');
messageContainer.id = 'message-container';
document.body.appendChild(messageContainer);

let audio = new Audio('./audio/song.mp3');
audio.preload = 'auto';
audio.loop = true;
audio.currentTime = 80;
let isAudioPlayed = false;

function showMessage(text, duration = 3000) {
    messageContainer.textContent = text;
    messageContainer.classList.add('visible');
    resultBtn.disabled = false;
    resetBtn.disabled = false;

    setTimeout(() => {
        messageContainer.classList.remove('visible');
    }, duration);
}

function fadeInAudio() {
    if (!isAudioPlayed) {
        audio.play();
        isAudioPlayed = true;

        let volume = 0;
        audio.volume = volume;

        let fadeInterval = setInterval(() => {
            if (volume < 0.5) {
                volume += 0.05;
                audio.volume = volume;
            } else {
                clearInterval(fadeInterval);
            }
        }, 100);
    }
}

function generateNumbers() {
    let generatedNumbers = new Set();
    while (generatedNumbers.size < 6) {
        let randomNumber = Math.round(Math.random() * 48) + 1;
        generatedNumbers.add(randomNumber);
    }
    return Array.from(generatedNumbers);
}

function getNumbersFromUser() {
    let numbersFromUser = [];

    for (let i = 1; i <= 6; i++) {
        let numberFromUser = parseInt(document.getElementById(`number${i}`).value);
        if (numberFromUser >= 1 && numberFromUser <= 49) {
            numbersFromUser.push(numberFromUser);
        } else {
            showMessage('Liczby muszą być w zakresie od 1 do 49!');
            return [];
        }
    }

    let uniqueUserNumbers = new Set(numbersFromUser);
    if (uniqueUserNumbers.size !== 6) {
        showMessage('Wprowadź unikalne liczby!');
        return [];
    }

    return numbersFromUser;
}

function checkMatch(userNumbers, lottoNumbers) {
    return userNumbers.filter(num => lottoNumbers.includes(num)).length;
}

function resetFields() {
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`number${i}`).value = '';
    }

    let fields = Array.from(document.getElementsByClassName('num-element'));
    fields.forEach(field => {
        field.textContent = '';
        field.classList.remove('animated');
    });
}

let scoreElement = document.getElementById('score');
const resultBtn = document.getElementById('check-result');
const resetBtn = document.getElementById('reset-btn');
let score = 0;

resultBtn.addEventListener('click', () => {
    resultBtn.disabled = true;

    fadeInAudio();

    let lottoNumbers = generateNumbers();
    let userNumbers = getNumbersFromUser();

    let fields = Array.from(document.getElementsByClassName('num-element'));

    if (userNumbers.length === 6) {
        fields.forEach(field => {
            field.textContent = '';
            field.classList.remove('animated');
        });

        lottoNumbers.forEach((number, index) => {
            setTimeout(() => {
                fields[index].textContent = number;
                fields[index].classList.add('animated');
                resetBtn.disabled = true;
            }, index * 500);
        });

        let matched = checkMatch(userNumbers, lottoNumbers);
        let message = '';

        switch (matched) {
            case 1:
                message = 'Wygrywasz 10$';
                score += 10;
                break;
            case 2:
                message = 'Wygrywasz 100$';
                score += 100;
                break;
            case 3:
                message = 'Wygrywasz 1000$';
                score += 1000;
                break;
            case 4:
                message = 'Wygrywasz 10000$';
                score += 10000;
                break;
            case 5:
                message = 'Wygrywasz 100000$';
                score += 100000;
                break;
            case 6:
                message = 'Wygrywasz 1000000$';
                score += 1000000;
                break;
            default:
                message = 'Nic nie wygrałeś';
        }

        setTimeout(() => {
            showMessage(message);
            scoreElement.textContent = `Wygrałeś łącznie: ${score}$`;
        }, 3000);
    }
});

resetBtn.addEventListener('click', function() {
    resetFields();
    isAudioPlayed = false;
});
