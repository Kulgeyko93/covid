export class DeathTable {
  constructor(allCases, allCountries, showChart, setCity) {
    this.allCases = allCases;
    this.allCountries = allCountries;
    this.showChart = showChart;
    this.setCity = setCity;

    this.tableIndex = 0;
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
    this.headers2 = [
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

    this.numbers = [
      this.allCases.cases,
      this.allCases.deaths,
      this.allCases.recovered,
      this.allCases.todayCases,
      this.allCases.todayDeaths,
      this.allCases.todayRecovered,
      Math.round(this.allCases.casesPerOneMillion / 10),
      Math.round(this.allCases.deathsPerOneMillion / 10),
      Math.round(this.allCases.recoveredPerOneMillion / 10),
      Math.round((this.allCases.todayCases / this.allCases.population) * 100000),
      Math.round((this.allCases.todayDeaths / this.allCases.population) * 100000),
      Math.round((this.allCases.todayRecovered / this.allCases.population) * 100000),
    ];
    this.renderGlobalTable();
    this.renderSlider();
  }

  renderGlobalTable() {
    const tableHeader = document.querySelector('.table-header');
    tableHeader.textContent = `${this.headers[this.tableIndex]}`;

    const tableNumber = document.querySelector('.table-number');
    tableNumber.textContent = this.numbers[this.tableIndex];
  }

  nextSlide() {
    this.tableIndex += 1;
    this.tableIndex = this.tableIndex > 11 ? 0 : this.tableIndex;
    this.renderGlobalTable();
  }

  renderSlider() {
    const that = this;
    document
      .querySelector('.next')
      .addEventListener('click', this.nextSlide.bind(that));
    document
      .querySelector('.previous')
      .addEventListener('click', this.previousSlide.bind(that));
    document.querySelector('.return').addEventListener('click', () => {
      that.headers = [
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

      that.numbers = [
        this.allCases.cases,
        this.allCases.deaths,
        this.allCases.recovered,
        this.allCases.todayCases,
        this.allCases.todayDeaths,
        this.allCases.todayRecovered,
        Math.round(this.allCases.casesPerOneMillion / 10),
        Math.round(this.allCases.deathsPerOneMillion / 10),
        Math.round(this.allCases.recoveredPerOneMillion / 10),
        Math.round((this.allCases.todayCases / this.allCases.population) * 100000),
        Math.round((this.allCases.todayDeaths / this.allCases.population) * 100000),
        Math.round((this.allCases.todayRecovered / this.allCases.population) * 100000),
      ];
      that.renderGlobalTable();
    });
  }

  previousSlide() {
    this.tableIndex -= 1;
    this.tableIndex = this.tableIndex < 0 ? 11 : this.tableIndex;
    this.renderGlobalTable();
  }

  renderCountryTable(countryName) {
    this.headers = [
      `${countryName} cases`,
      `${countryName} deaths`,
      `${countryName} recovered`,
      `${countryName} last day cases`,
      `${countryName} last day deaths`,
      `${countryName} last day recovered`,
      `${countryName} cases per 100000`,
      `${countryName} deaths per 100000`,
      `${countryName} recovered per 100000`,
      `${countryName} last day cases per 100000`,
      `${countryName} last day deaths per 100000`,
      `${countryName} last day recovered per 100000`,
    ];

    const countryIndex = this.allCountries.findIndex(
      (item) => item.country === countryName,
    );
    if (countryIndex === -1) {
      this.numbers = 0
    } else {
      this.numbers = [
        this.allCountries[countryIndex].cases,
        this.allCountries[countryIndex].deaths,
        this.allCountries[countryIndex].recovered,
        this.allCountries[countryIndex].todayCases,
        this.allCountries[countryIndex].todayDeaths,
        this.allCountries[countryIndex].todayRecovered,
        Math.round(this.allCountries[countryIndex].casesPerOneMillion / 10),
        Math.round(this.allCountries[countryIndex].deathsPerOneMillion / 10),
        Math.round(this.allCountries[countryIndex].recoveredPerOneMillion / 10),
        Math.round(
          (this.allCountries[countryIndex].todayCases
            / this.allCases.population)
            * 100000,
        ),
        Math.round(
          (this.allCountries[countryIndex].todayDeaths
            / this.allCases.population)
            * 100000,
        ),
        Math.round(
          (this.allCountries[countryIndex].todayRecovered
            / this.allCases.population)
            * 100000,
        ),
      ];
      this.showChart(this.headers2[this.tableIndex], countryName);
      this.setCity(countryName);
    }


    document
      .querySelectorAll('.invisible')
      .forEach((item) => item.classList.remove('invisible'));
    document.querySelector('.input-list').value = '';

    this.renderGlobalTable();
  }
}
