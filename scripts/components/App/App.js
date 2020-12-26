import { TopCityInfection } from './../TopCityInfection/TopCityInfection.js';
import { Map } from './../Map/Map.js';
import { getAllCases, getCountries, getHistory, getHistoryAll } from './../../Data/Data.js';
import { DeathTable } from './../DeathTable/DeathTable.js';
import { ChartAll } from './../ChartAll/ChartAll.js';

export class App {
   constructor() {
      this.param = "Global cases";
      this.city = undefined;
      this.tableIndex = 0;
      this.headers = [
         "Global cases",
         "Global deaths",
         "Global recovered",
         "Last day cases",
         "Last day deaths",
         "Last day recovered",
         "Global cases per 100000",
         "Global deaths per 100000",
         "Global recovered per 100000",
         "Last day cases per 100000",
         "Last day deaths per 100000",
         "Last day recovered per 100000",
      ];
      this.render();
      
      this._getData();
   }

   setCity(city){
      return this.city = city;
   }

   async _getData() {
      this.allCases = await getAllCases();
      this.allCountries = await getCountries();
      this.countryHistory = await getHistory();
      this.historyAll = await getHistoryAll();
      

      this.changeParametr();

      
      this._initChartAll({countryHistory: this.countryHistory,
         historyAll: this.historyAll, 
         allCountries: this.allCountries,
         allCases: this.allCases});
         this.showChart = this.chartAll.getData.bind(this.chartAll);
      this._initDeathTable(this.showChart);
      this._initTopCityInfection();
      
      this.chooseCountry = this.DeathTable.renderCountryTable.bind(this.DeathTable);
      this._initMap( this.allCountries, this.chooseCountry, this.showChart, this.setCity.bind(this));
   }
   changeParametr() {
      document.querySelectorAll('.table-container button').forEach((item) => {
         item.addEventListener('click', (e) => {
            if(e.target.className === 'return') {
               this.city === undefined;
               this.showChart(this.headers[this.tableIndex]);
            }
            if(e.target.className === 'previous') {
               this.tableIndex -= 1;
               this.tableIndex = this.tableIndex < 0 ? 11 : this.tableIndex;
               this.map.renderNewParam(this.headers[this.tableIndex]);
               this.showChart(this.headers[this.tableIndex], this.city);

            }
            if(e.target.className === 'next') {
               this.tableIndex += 1;
               this.tableIndex = this.tableIndex > 11 ? 0 : this.tableIndex;
               this.map.renderNewParam(this.headers[this.tableIndex]);
               this.showChart(this.headers[this.tableIndex], this.city)
            }
         })
      })
   }

   _initChartAll(a) {
      this.chartAll = new ChartAll(a)
   }
   _initTopCityInfection() {
      this.TopCityInfection = new TopCityInfection(
         this.allCases,
         this.allCountries,
         this.DeathTable.renderCountryTable.bind(this.DeathTable),
         this.getFlags
      );
   }
   _initMap(a, b, c, d) {
      this.map = new Map(a, b, c, d)
   }
   _initDeathTable() {
      this.DeathTable = new DeathTable(this.allCases, this.allCountries, this.showChart, this.setCity.bind(this));
   }

   render() {
      document.querySelector('.wrapper').innerHTML = `
      <div class="container">
         <header class="header">
            Covid-19. Develpers: https://github.com/kulgeyko93 and https://github.com/zrudikkk
         </header>
         <main class="main">
            <section class="list-container">
               <div class="list-header">
               Global Cases
               </div>
               <input class="input-list" type="text" placeholder="Enter country">
               <div class="list"></div>
            </section>
            <section class="main__map">
               <svg id="map-world"></svg>
            </section>
         </main>
         <section class='info'>
            <div class="info__all">
               <div class="table-container">
               <div class="table">
               <div class="table-header"></div>
               <div class="table-number"></div>
               </div>
               <button class="previous">&#10094;</button>
               <button class="return">Return to global measures</button>
               <button class="next">&#10095;</button>
               </div>
            </div>
            <div class="diagram">
               <canvas id="myChart"></canvas>
            </div>
         </section>
      </div>
      `
   }
}
