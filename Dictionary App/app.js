let userInput = document.querySelector(".search input");
let ul = document.querySelector("ul");
let infoText = document.querySelector(".info-text");

//remove ui  and audio play
ul.style.display = "none";
let audio;

//Synonymထဲက စာလုံးကို နှိပ်လိုက်ရင် ရှာပေးအောင်လုပ်ထားတာ
function search_synonyms(key) {
  searchWorlds(key);
}

//Userပြဖို့အတွက် စာလုံးရဲ့arry နောက်ဆုံး ခန်းကို ယူထားတာ
function showUsers(data) {
  let Last_phonetic = data[0].phonetics.length - 1;
  let Last_meaning = data[0].meanings.length - 1;
  let Last_definition = data[0].meanings[Last_meaning].definitions.length - 1;

  //   အသံရအောင်ရေးထားတာ,Ui ပြန်ပေါ်အောင် ဖွင့်ထားတာထား
  ul.style.display = "block";
  audio = new Audio(`${data[0].phonetics[Last_phonetic].audio}`);

  //Wordရဲ့ arry နောက်ဆုံးခန်းက  meaning and part of speech  ကိုရှာပေးဖို့ ,
  document.querySelector(".details p").innerText = data[0].word;
  document.querySelector(
    ".details span"
  ).innerText = `${data[0].meanings[Last_meaning].partOfSpeech} | ${data[0].phonetics[Last_phonetic].text} `;
  document.querySelector(".meaning span").innerText =
    data[0].meanings[Last_meaning].definitions[Last_definition].definition;

  //Example ပြဖို့အတွက်
  let example =
    data[0].meanings[Last_meaning].definitions[Last_definition].example;
  if (example == undefined) {
    document.querySelector(".example ").style.display = "none";
  } else {
    document.querySelector(".example ").style.display = "block";
    document.querySelector(".example span").innerText = example;
  }

  //   API ထဲမှာရှိတဲ့ အရေအတွက် အတိုင်း Synonym ပြဖို့အတွက်  ‌
  let synonyms = data[0].meanings[Last_meaning].synonyms[0];
  let synonyms_length = data[0].meanings[Last_meaning].synonyms.length;

  //Synonym ပြဖို့အတွက်
  if (synonyms == undefined) {
    document.querySelector(".synonyms").style.display = "none";
  } else {
    document.querySelector(".synonyms .list").innerHTML = "";
    document.querySelector(".synonyms").style.display = "block";
    for (let i = 0; i < synonyms_length; i++) {
      //တစ်ခါရိုက်ရှာပီး နောက်တစ်ခါရိုက်ရှာရင် loopပိတ်ထားတာကြောင့် စာလုံးတွေ ထပ်ပေါင်းတဲ့ error ကနေ cover ဖစ်အောင်ရေးထားတာ
      let item = `<span onclick = "search_synonyms('${data[0].meanings[Last_meaning].synonyms[i]}')">${data[0].meanings[Last_meaning].synonyms[i]}</span>`;
      document
        .querySelector(".synonyms .list")
        .insertAdjacentHTML("beforeend", item);
    }
  }
}

//စာလုံးရှာရင် မတွေ့ရင် မတွေပြဖို့
function showWords(result, word) {
  if (result.title) {
    infoText.style.color = "#ef2922";
    infoText.innerHTML = `Nothing found for  <b> ${word}</b> .`;
  } else {
    userInput.blur();
    infoText.style.color = "#01ad43";
    userInput.value = "";
    infoText.innerHTML = ``;
    showUsers(result);
  }
}
// တွေ့ရင် searching လုပ်နေပါတယိလို့ပြဖို့, api fetch
function searchWorlds(word) {
  ul.style.display = "none";
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching ${word}`;
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => response.json())
    .then((result) => showWords(result, word));
}
//စာလုံးရိုက်ပီး enterနှိပ်မှာရှာပေးတာ
userInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) {
    searchWorlds(e.target.value);
  }
});

//စာတစ်လုံးရှာပီးရင် နောက်တစ်လူံးရှာဖို့နှိပ်လိုက်ရင် ရှာထားတဲ့စာလုံးရော uiကိုရော ဖျောက်ပေးထားတာ
userInput.addEventListener("focus", (_) => {
  ul.style.display = "none";
  infoText.style.color = "#9a9a9a";
  infoText.innerText = `Type any existing word and press enter to get meaning, example,
        synonyms, etc.`;
});

//အသံခလုတ်ကို အလုပ်"ဖို့ ခေါထားတာ
document.querySelector(".fa-volume-up").addEventListener("click", (_) => {
  audio.play();
});
