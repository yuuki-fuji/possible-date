// 時刻を動的に生成する関数
const generateTimeOptions = (startTime, endTime, intervalMinutes) => {
    const dataList = document.getElementById('data-list');
    dataList.innerHTML = ''; // 既存の内容をクリア

    let start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    while (start <= end) {
        const hours = String(start.getHours()).padStart(2, '0');
        const minutes = String(start.getMinutes()).padStart(2, '0');
        const option = document.createElement('option');
        option.value = `${hours}:${minutes}`;
        dataList.appendChild(option);

        // インターバルを追加して次の時刻に移動
        start.setMinutes(start.getMinutes() + intervalMinutes);
    }
};

// データをlocalStorageから復元する関数
const restoreDataFromLocal = () => {
    const outputArea = document.getElementById('output');
    const savedData = localStorage.getItem('outputData');
    if (savedData) {
        outputArea.value = savedData; // localStorageからデータを復元
    }
};

// データをlocalStorageに保存する関数
const saveDataToLocal = () => {
    const outputArea = document.getElementById('output').value;
    localStorage.setItem('outputData', outputArea); // localStorageにデータを保存
};

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    // 日付を今日に設定
    const dateInput = document.getElementById('date');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 月は0から始まるので +1
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`; // YYYY-MM-DD形式にする

    // 時刻のオプション生成
    generateTimeOptions('08:00', '19:00', 30);

    // localStorageからデータを復元
    restoreDataFromLocal();
});

// 開始時刻を選択した際に1時間後を終了時刻に設定
document.getElementById('start-time').addEventListener('change', function() {
    const startTime = document.getElementById('start-time').value;
    const [hours, minutes] = startTime.split(':').map(Number);

    // 1時間後の時刻を計算
    const endTimeHours = hours + 1;
    const endTime = `${String(endTimeHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    // 終了時刻に1時間後の時刻を設定
    document.getElementById('end-time').value = endTime;
});

// 「追加する」ボタンの動作
document.getElementById("add-time").addEventListener("click", function() {
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;
    const isDotChecked = document.getElementById("dot-checkbox").checked; // チェックボックスの状態を取得

    if (date && startTime) {
        const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short'
        });
        let result = `${formattedDate} ${startTime} 〜 `;

        // endTimeが入力されていれば、それを追加する
        if (endTime) {
            result += endTime;
        }

        // 「・」がONなら、先頭に「・」を追加
        if (isDotChecked) {
            result = `・${result}`;
        }

        const outputArea = document.getElementById("output");
        outputArea.value += result + '\n';

        // データをlocalStorageに保存
        saveDataToLocal();
    } else {
        alert("日付と時刻を正しく選択してください。");
    }
});

// 「コピー」ボタンの動作
document.getElementById("copy-to-clipboard").addEventListener("click", function() {
    const outputText = document.getElementById("output").value;
    if (outputText) {
        navigator.clipboard.writeText(outputText).then(() => {
            alert("クリップボードにコピーされました！");
        }).catch(err => {
            alert("コピーに失敗しました: " + err);
        });
    } else {
        alert("コピーする内容がありません。");
    }
});

// 「クリア」ボタンの動作
document.getElementById("clear-output").addEventListener("click", function() {
    const outputArea = document.getElementById("output");
    outputArea.value = ''; // テキストエリアをクリア
    localStorage.removeItem('outputData'); // localStorageからも削除
});
