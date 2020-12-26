import { Keyboard } from '../Keyboard/Keyboard.js';

export class TopCityInfection {
  constructor(allCases, allCountries, chooseCountry) {
    this.allCases = allCases;
    this.allCountries = allCountries;
    this.listIndex = 0;
    this.headers = [
      'Global cases',
      'Global deaths',
      'Global recovered',
      'Last day cases',
      'Last day deaths',
      'Last day recovered',
      'Global cases per 100000',
      'Global deaths per 100000',
      'Global recovered per 100000',
      'Last day cases per 100000',
      'Last day deaths per 100000',
      'Last day recovered per 100000',
    ];
    this.sorters = [
      (a, b) => b.cases - a.cases,
      (a, b) => b.deaths - a.deaths,
      (a, b) => b.recovered - a.recovered,
      (a, b) => b.todayCases - a.todayCases,
      (a, b) => b.todayDeaths - a.todayDeaths,
      (a, b) => b.todayRecovered - a.todayRecovered,
      (a, b) => b.casesPerOneMillion - a.casesPerOneMillion,
      (a, b) => b.deathsPerOneMillion - a.deathsPerOneMillion,
      (a, b) => b.recoveredPerOneMillion - a.recoveredPerOneMillion,
      (a, b) => b.todayCases / b.population - a.todayCases / a.population,
      (a, b) => b.todayDeaths / b.population - a.todayDeaths / a.population,
      (a, b) => b.todayRecovered / b.population - a.todayRecovered / a.population,
    ];

    this.renderGlobalList();
    this.setDependencies();
    this.chooseCountry = chooseCountry;
    this.inputAction();
    Keyboard.init();
  }

  renderGlobalList() {
    document.querySelector('.list-header').textContent = this.headers[
      this.listIndex
    ];

    const listContent = document.querySelector('.list');

    listContent.addEventListener('click', (e) => {
      this.chooseCountry(
        e.target.parentNode.querySelector('.row-country').textContent.trim(),
      );
      Keyboard.close();
    });

    let listStatStr = '';

    this.allCountries.sort(this.sorters[this.listIndex]).forEach((item) => {
      let parameter;
      switch (this.listIndex) {
        case 1:
          parameter = item.deaths;
          break;
        case 2:
          parameter = item.recovered;
          break;
        case 3:
          parameter = item.todayCases;
          break;
        case 4:
          parameter = item.todayDeaths;
          break;
        case 5:
          parameter = item.todayRecovered;
          break;
        case 6:
          parameter = item.casesPerOneMillion / 10;
          break;
        case 7:
          parameter = item.deathsPerOneMillion / 10;
          break;
        case 8:
          parameter = item.recoveredPerOneMillion / 10;
          break;
        case 9:
          parameter = (item.todayCases / item.population) * 100000;
          break;
        case 10:
          parameter = (item.todayDeaths / item.population) * 100000;
          break;
        case 11:
          parameter = (item.todayRecovered / item.population) * 100000;
          break;
        default:
          parameter = item.cases;
          break;
      }
      if (parameter % 1 !== 0 && parameter !== 0) {
        parameter = parameter.toFixed(1);
      }
      listStatStr += `
                    <div class='list-row'>
                        <div class='row-number'>${parameter}</div>
                        <div class='row-country'>${item.country}
                    </div>
                    <img id='img' src= '${item.countryInfo.flag}' alt='${item.country}'>
                    </div>
                    `;
    });

    listContent.innerHTML = listStatStr;
  }

  handleNext() {
    this.listIndex += 1;
    this.listIndex = this.listIndex > 11 ? 0 : this.listIndex;
    this.renderGlobalList();
  }

  handlePrevious() {
    this.listIndex -= 1;
    this.listIndex = this.listIndex < 0 ? 11 : this.listIndex;
    this.renderGlobalList();
  }

  setDependencies() {
    const that = this;
    const next = document.querySelector('.next');
    next.addEventListener('click', this.handleNext.bind(that));

    const previous = document.querySelector('.previous');
    previous.addEventListener('click', this.handlePrevious.bind(that));
  }

  inputHandler(e) {
    const rowsCollection = document.querySelectorAll('.list-row');
    rowsCollection.forEach((item) => {
      const countryName = item.querySelector('.row-country').textContent.toLowerCase();
      const inputValue = e.target.value.toLowerCase();
      if (countryName.indexOf(inputValue) !== 0) {
        item.classList.add('invisible');
      } else {
        item.classList.remove('invisible');
      }
    });
  }

  inputAction() {
    document
      .querySelector('.input-list')
      .addEventListener('input', (e) => this.inputHandler(e));
  }
}
