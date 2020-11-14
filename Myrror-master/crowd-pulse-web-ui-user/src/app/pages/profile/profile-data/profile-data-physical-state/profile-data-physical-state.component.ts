import {Component, Input, OnInit} from '@angular/core';
import {StatsService} from '../../../../services/stats.service';
import {environment} from '../../../../../environments/environment';
import {InfoDialogComponent} from '../../../../components/info-dialog/info-dialog.component';
import {MatDialog} from '@angular/material';
import {Chart} from 'angular-highcharts';
import {ToastrService} from 'ngx-toastr';
import { TelegramService } from '../../../../services//telegram.service';


@Component({
  selector: 'app-profile-physical-state',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-physical-state.component.html'
})
export class ProfileDataPhysicalStateComponent {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

  /**
   * Custom chart.
   */
  customChart: Chart;
  customChart2: Chart;
  customChart3: Chart;

  /**
   * Sleep array.
   */
  sleeps = [];

  /**
   * Analyses array
   */
  analyses = [];

  /**
   * Medical Areas array
   */
  medicalArea = [];

  /**
   * For UI progress spinner, true if charts are loading.
   */
  chartsLoading: boolean;

  /**
   * Available behavior source.
   */
  types = [ {
    id: 'sleep',
    name: 'Sleep',
  }, {
    id: 'heart',
    name: 'Heart-Rate',
  }, {
    id: 'body',
    name: 'Body',
  },{
    id: 'diagnosis',
    name: 'Diagnosis',
  },{
    id: 'analysis',
    name: 'Analysis',
  },{
    id: 'therapy',
    name: 'Therapy',
  },{
    id: 'ma',
    name: 'Medical Area',
  },{
    id: 'medicalVisit',
    name:'Medical Visit',
  },{
    id: 'disease',
    name:'Disease',
  },{
    id: 'hospitalization',
    name:'Hospitalization',
  }

  ];

  /**
  * therapy array
  */
  therapy: any;
  /**
  * medicalVisit array
  */
  medicalVisit: any;
  /**
  * disease array
  */
  disease: any;
  /**
  * hospitalization array
  */
  hospitalization: any;

  /**
   * Available behavior source.
   */
  visualization = [ {
    id: 'pie',
    name: 'Pie Chart',
  }, {
    id: 'bar',
    name: 'Bar Chart',
  }, {
    id: 'line',
    name: 'Line Chart',
  }, {
    id: 'table',
    name: 'Table',
  },
  ];

  /**
   *  For the mat exclusive only for Analysis
   */
  showAnalysis = false;



  /**
   * Selected type.
   */
  selectedType: {id: string, name: string};
  

  /**
   * Selected chart.
   */
  selectedChart: {id: string, name: string};

  showTableTherapy = false;
  showTableMedicalVisit = false;
  showTableDisease = false;
  showTableHospitalization = false;
  showMedicalArea = false;

  /**
   * Filter available.
   */
  filter = {
    dateFrom: new Date(),
    dateTo: new Date(),
    type: this.types[1].id,
    selectedAnalysis: "",
  };

  /**
   * Application name.
   */
  appName = environment.appName;

  /**
   * Contains all the posts coordinates
   */
  postsCoordinates: any;


  constructor(
    private statsService: StatsService,
    private telegramService: TelegramService,
    private toast: ToastrService,
    private dialog: MatDialog,
  ) {}


  /**
   * @override
   */
  ngOnInit(): void {
    /*prendo tutte le possibili analisi dell'utente*/
    this.getTelegramAnalysis(1000);
    /*prendo tutte le medical area dall'utente*/
    this.getTelegramMedicalArea(1000);
    /*Imposto la data di partenza a inizio mese*/
    this.filter.dateFrom.setDate(1);
    /*Imposto la data di fine al giorno dopo di quello corrente*/
    this.filter.dateTo.setDate(this.filter.dateTo.getDate() + 1);
   
    
   
  }



  /**
   * Build chart with filter value.
   */
  updateChart() {

    this.customChart = undefined;
    this.customChart2 = undefined;
    this.customChart3 = undefined;
    this.chartsLoading = true;
    this.deleteAnalysisDuplicate();
    switch (this.selectedType.id) {

      case 'sleep':
        this.showMedicalArea = false;
        this.showTableTherapy = false;
        this.showTableMedicalVisit = false;
        this.showTableDisease = false;
        this.showTableHospitalization = false;
        this.showAnalysis= false;
        if (this.selectedChart.id == 'line') {
            this.buildSleepDataSourceChartLine(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
          this.buildSleepDataSourceChartLineDuration(this.selectedChart.id).then((chart) => {
            this.customChart2 = chart;
          });
           this.buildSleepDataSourceChartLineEfficiency(this.selectedChart.id).then((chart) => {
            this.customChart3 = chart;
          });
        } else  if (this.selectedChart.id == 'bar') {
          this.buildSleepDataSourceChartBar(this.selectedChart.id).then((chart) => {
          this.customChart = chart;
          });
          this.buildSleepDataSourceChartBarDuration(this.selectedChart.id).then((chart) => {
            this.customChart2 = chart;
          });
          this.buildSleepDataSourceChartBarEfficiency(this.selectedChart.id).then((chart) => {
            this.customChart3 = chart;
          });
        }  else  if (this.selectedChart.id == 'pie') {
          this.buildSleepDataSourceChartPie(this.selectedChart.id).then((chart) => {
          this.customChart = chart;
          });
        }
        break;

      case 'heart':
        this.showMedicalArea = false;
        this.showTableTherapy = false;
        this.showTableMedicalVisit = false;
        this.showTableDisease = false;
        this.showTableHospitalization = false;
        this.showAnalysis= false;
        if (this.selectedChart.id == 'line') {
          this.buildHeartDataSourceChartLine(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
          this.buildHeartDataSourceChartLineRate(this.selectedChart.id).then((chart) => {
            this.customChart2 = chart;
          });
          this.buildHeartDataSourceChartLinePeak(this.selectedChart.id).then((chart) => {
            this.customChart3 = chart;
          });
        } else  if (this.selectedChart.id == 'bar') {
          this.buildHeartDataSourceChartBar(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
          this.buildHeartDataSourceChartBarRate(this.selectedChart.id).then((chart) => {
            this.customChart2 = chart;
          });
          this.buildHeartDataSourceChartBarPeak(this.selectedChart.id).then((chart) => {
            this.customChart3 = chart;
          });
        }  else  if (this.selectedChart.id == 'pie') {
          this.buildHeartDataSourceChart(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
        }

        break;
      case 'body':
        this.showMedicalArea = false;
        this.showTableTherapy = false;
        this.showTableMedicalVisit = false;
        this.showTableDisease = false;
        this.showTableHospitalization = false;
        this.showAnalysis= false;
        if (this.selectedChart.id == 'line') {
          this.buildBodyDataSourceChartLineWeight(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
          this.buildBodyDataSourceChartLineFat(this.selectedChart.id).then((chart) => {
            this.customChart2 = chart;
          });
          this.buildBodyDataSourceChartLineBMI(this.selectedChart.id).then((chart) => {
            this.customChart3 = chart;
          });
        }
        break;
      case 'diagnosis':
        this.showMedicalArea = false;
        this.showTableTherapy = false;
        this.showTableMedicalVisit = false;
        this.showTableDisease = false;
        this.showTableHospitalization = false;
        this.showAnalysis= false;
        if (this.selectedChart.id == 'bar'){
          this.buildDiagnosisDataSourceChartBar(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
        }
        break;

      case 'analysis':
        this.showMedicalArea = false;
        this.showTableTherapy = false;
        this.showTableMedicalVisit = false;
        this.showTableDisease = false;
        this.showTableHospitalization = false;
        this.showAnalysis= true;
        this.deleteAnalysisDuplicate();
        if(this.selectedChart.id == 'line'){
          if(!(this.filter.selectedAnalysis ==="")){
          this.buildAnalysisDataSourceChartLine(this.selectedChart.id).then((chart) =>{
            this.customChart = chart;
          });
          }

        }
        break;

      case 'therapy':
        this.showMedicalArea = false;
        this.showAnalysis= false;
        this.showTableMedicalVisit = false;
        this.showTableDisease = false;
        this.showTableHospitalization = false;
        if(this.selectedChart.id == 'table'){
          this.buildTherapyDataSourceTable(this.selectedChart.id)
          this.showTableTherapy = true;
        }else{
          this.showTableTherapy = false;
        }

        break;

      case 'medicalVisit':
      this.showMedicalArea = false;
      this.showAnalysis= false;
      this.showTableTherapy = false;
      this.showTableDisease = false;
      this.showTableHospitalization = false;
      if(this.selectedChart.id == 'table'){
        this.buildMedicalVisitDataSourceTable(this.selectedChart.id)
        this.showTableMedicalVisit = true;
      }else{
        this.showTableMedicalVisit = false;
      }

      break;

      case 'disease':
        this.showMedicalArea = false;
        this.showAnalysis= false;
        this.showTableTherapy = false;
        this.showTableHospitalization = false;
        this.showTableMedicalVisit = false;
        if(this.selectedChart.id == 'table'){
          this.buildDiseaseDataSourceTable(this.selectedChart.id)
          this.showTableDisease = true;
        }else{
          this.showTableDisease = false;
        }

        break;

      case 'hospitalization':
        this.showMedicalArea = false;
        this.showAnalysis= false;
        this.showTableTherapy = false;
        this.showTableMedicalVisit = false;
        this.showTableDisease = false;
        if(this.selectedChart.id == 'table'){
          this.buildHospitalizationDataSourceTable(this.selectedChart.id)
          this.showTableHospitalization = true;
        }else{
          this.showTableHospitalization = false;
        }

        break;  
        
      case 'ma':
        this.showTableTherapy = false;
        this.showTableMedicalVisit = false;
        this.showTableDisease = false;
        this.showTableHospitalization = false;
        this.showAnalysis= false;
        if(this.selectedChart.id == 'table'){
          this.showMedicalArea = true;
        }else {
          this.showMedicalArea = false;
        }
        
        break;

      default:
        this.showTableTherapy = false;
        this.showTableMedicalVisit = false;
        this.showTableDisease = false;
        this.showTableHospitalization = false;
        this.customChart = null;
        this.showMedicalArea = false;
        break;
    }

  }


  /**
   * Build a pie chart with the sleep data source type frequency.
   * @param type: the chart type.
   */
  private buildSleepDataSourceChartPie(type?: string): Promise<Chart | any> {
    return this.statsService.getSleepTypeDataFitbitLineDuration(this.filter).then(
      (stats) => {

        let  minutesAfterWakeup = 0, minutesAsleep = 0,
          minutesAwake = 0, minutesToFallAsleep = 0, timeInBed = 0;
        let i;
        for (i = 0; i < stats.length; i++) {


            if (stats[i].minutesAfterWakeup) {
              minutesAfterWakeup = minutesAfterWakeup + stats[i].minutesAfterWakeup;
            }
            if (stats[i].minutesAsleep) {
              minutesAsleep = minutesAsleep + stats[i].minutesAsleep;
            }
            if (stats[i].minutesAwake) {
              minutesAwake = minutesAwake + stats[i].minutesAwake;
            }
            if (stats[i].minutesToFallAsleep) {
              minutesToFallAsleep = minutesToFallAsleep + stats[i].minutesToFallAsleep;
            }
            if (stats[i].timeInBed) {
              timeInBed = timeInBed + stats[i].timeInBed;
            }
        }

        const sleeps = [{name: 'Minutes After Wakeup', value: minutesAfterWakeup}, {name: 'Minutes A Sleep', value: minutesAsleep},
          {name: 'Minutes A Wake', value: minutesAwake}, {name: 'Minutes To Fall A sleep', value: minutesToFallAsleep},
          {name: 'Time In Bed', value: timeInBed}];

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'pie'
            },
            title: {
              text: 'SLEEP'
            },
            subtitle: {
              text: 'This graph shows the distribution of minutes of sleep'
            },
            credits: {
              enabled: false
            },
            series: [{
              data: sleeps.map((sleep) => ({name: sleep.name, y: sleep.value}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }


  /**
   * Build a bar chart with the sleep data source type frequency.
   * @param type: the chart type.
   */
  private buildSleepDataSourceChartBar(type?: string): Promise<Chart | any> {
    return this.statsService.getSleepTypeDataFitbitLineDuration(this.filter).then(
      (stats) => {

        let  minutesAfterWakeup = 0, minutesAsleep = 0,
          minutesAwake = 0, minutesToFallAsleep = 0, timeInBed = 0;
        let i;
        for (i = 0; i < stats.length; i++) {


          if (stats[i].minutesAfterWakeup) {
            minutesAfterWakeup = minutesAfterWakeup + stats[i].minutesAfterWakeup;
          }
          if (stats[i].minutesAsleep) {
            minutesAsleep = minutesAsleep + stats[i].minutesAsleep;
          }
          if (stats[i].minutesAwake) {
            minutesAwake = minutesAwake + stats[i].minutesAwake;
          }
          if (stats[i].minutesToFallAsleep) {
            minutesToFallAsleep = minutesToFallAsleep + stats[i].minutesToFallAsleep;
          }
          if (stats[i].timeInBed) {
            timeInBed = timeInBed + stats[i].timeInBed;
          }
        }

        const sleeps = [{name: 'Minutes After Wakeup', value: minutesAfterWakeup}, {name: 'Minutes A Sleep', value: minutesAsleep},
          {name: 'Minutes A Wake', value: minutesAwake}, {name: 'Minutes To Fall A sleep', value: minutesToFallAsleep},
          {name: 'Time In Bed', value: timeInBed}];

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'bar'
            },
            title: {
              text: 'SLEEP'
            },
            subtitle: {
              text: 'This graph shows the distribution of minutes of sleep'
            },
            xAxis: {
              title: {
                text: 'TYPE OF SLEEP'
              },
              categories: ['minutesAfterWakeup', 'minutesAsleep', 'minutesAwake', 'minutesToFallAsleep', 'timeInBed']
            },
            yAxis: {
              title: {
                text: 'TOTAL MINUTES'
              },
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Minutes',
              data: sleeps.map((sleep) => ({name: sleep.name, y: sleep.value}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }


  /**
   * Build a line chart with the sleep data source type frequency.
   * @param type: the chart type.
   */
  private buildSleepDataSourceChartBarEfficiency(type?: string): Promise<Chart | any> {
    return this.statsService.getSleepTypeDataFitbitLineDuration(this.filter).then(
      (stats) => {


        const arrayData = [];
        let j;
        if (stats && stats.length > 0) {

          for (j = 0; j < stats.length; j++) {
            if (stats[j].timestamp) {
              arrayData.push(new Date(stats[j].timestamp).toDateString());
            }
          }

          arrayData.reverse();

        }


        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'bar'
            },
            title: {
              text: 'SLEEP'
            },
            subtitle: {
              text: 'This chart shows sleep efficiency'
            },
            xAxis: {
              title: {
                text: 'DATA'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'EFFICIENCY VALUE'
              },
            },
            plotOptions: {
              series: {
                color: '#ff6600'
              }
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Efficiency',
              data: stats.map((stat) => ({name: 'Efficiency', y: stat.efficiency}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }



  /**
   * Build a bar chart with the sleep data source type frequency.
   * @param type: the chart type.
   */
  private buildSleepDataSourceChartBarDuration(type?: string): Promise<Chart | any> {
    return this.statsService.getSleepTypeDataFitbitLineDuration(this.filter).then(
      (stats) => {


        const arrayData = [];
        let j;
        if (stats && stats.length > 0) {

          for (j = 0; j < stats.length; j++) {
            if (stats[j].timestamp) {
              arrayData.push(new Date(stats[j].timestamp).toDateString());
            }
          }
          arrayData.reverse();
        }

        const duration = [];
        let i, d = 0, a = 0;
        for (i = 0; i < stats.length; i++) {

          if (stats[i].duration) {
            d = ((stats[i].duration / (1000 * 60 * 60)) % 24);
            a = Number(d.toFixed());
            duration.push({value: d});
          }
        }

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'bar'
            },
            title: {
              text: 'SLEEP'
            },
            subtitle: {
              text: 'This graph shows the trend over time of hours sleep'
            },
            xAxis: {
              title: {
                text: 'DATA'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'HOURS OF SLEEP'
              },
            },
            plotOptions: {
              series: {
                color: '#ff6600'
              }
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Duration',
              data: duration.map((stat) => ({name: 'Sleep duration', y: stat.value}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }


  /**
   * Build a line chart with the sleep data source type frequency.
   * @param type: the chart type.
   */
  private buildSleepDataSourceChartLine(type?: string): Promise<Chart | any> {
    return this.statsService.getSleepTypeDataFitbitLineDuration(this.filter).then(
      (stats) => {


        const arrayData = [];
        let j;
        if (stats && stats.length > 0) {

          for (j = 0; j < stats.length; j++) {
            if (stats[j].timestamp) {
              arrayData.push(new Date(stats[j].timestamp).toDateString());
            }
          }
          arrayData.reverse();
        }

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'SLEEP'
            },
            subtitle: {
              text: 'This graph shows the trend over time of hours sleep'
            },
            xAxis: {
              title: {
                text: 'DATA'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'MINUTES VALUE'
              },
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Minutes After Wakeup',
              data: stats.map((stat) => ({name: 'Minutes After Wakeup', y: stat.minutesAfterWakeup}))
            },
            {
              name: 'Minutes Sleep',
              data: stats.map((stat) => ({name: 'Minutes Sleep', y: stat.minutesAsleep}))
            },
            {
              name: 'Minutes Wake',
              data: stats.map((stat) => ({name: 'Minutes Wake', y: stat.minutesAwake}))
            },
            {
              name: 'Minutes To Fall a Sleep',
              data: stats.map((stat) => ({name: 'Minutes To Fall a Sleep', y: stat.minutesToFallAsleep}))
            },
            {
              name: 'Time In Bed',
              data: stats.map((stat) => ({name: 'Time In Bed', y: stat.timeInBed}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }



  /**
   * Build a line chart with the sleep data source type frequency.
   * @param type: the chart type.
   */
  private buildSleepDataSourceChartLineEfficiency(type?: string): Promise<Chart | any> {
    return this.statsService.getSleepTypeDataFitbitLineDuration(this.filter).then(
      (stats) => {


        const arrayData = [];
        let j;
        if (stats && stats.length > 0) {

          for (j = 0; j < stats.length; j++) {
            if (stats[j].timestamp) {
              arrayData.push(new Date(stats[j].timestamp).toDateString());
            }
          }
          arrayData.reverse();
        }


        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'SLEEP-EFFICIENCY'
            },
            subtitle: {
              text: 'This chart shows sleep efficiency'
            },
            xAxis: {
              title: {
                text: 'DATA'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'EFFICIENCY VALUE'
              },
            },
            plotOptions: {
              series: {
                color: '#ff6600'
              }
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Efficiency',
              data: stats.map((stat) => ({name: 'Efficiency', y: stat.efficiency}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }



  /**
   * Build a line chart with the sleep data source type frequency.
   * @param type: the chart type.
   */
  private buildSleepDataSourceChartLineDuration(type?: string): Promise<Chart | any> {
    return this.statsService.getSleepTypeDataFitbitLineDuration(this.filter).then(
      (stats) => {


        const arrayData = [];
        let j;
        if (stats && stats.length > 0) {

          for (j = 0; j < stats.length; j++) {
            if (stats[j].timestamp) {
              arrayData.push(new Date(stats[j].timestamp).toDateString());
            }
          }
          arrayData.reverse();
        }

        const duration = [];
        let i, d = 0, a = 0;
        for (i = 0; i < stats.length; i++) {

          if (stats[i].duration) {
            d = ((stats[i].duration / (1000 * 60 * 60)) % 24);
            a = Number(d.toFixed());
            duration.push({value: d});
          }
        }

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'SLEEP-DURATION'
            },
            subtitle: {
              text: 'This graph shows the trend over time of hours sleep'
            },
            xAxis: {
              title: {
                text: 'DATA'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'HOURS OF SLEEP'
              },
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Duration',
              data: duration.map((stat) => ({name: 'Sleep duration', y: stat.value}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }





  /**
   * Build a pie chart with the heart data source type frequency.
   * @param type: the chart type.
   */
  private buildHeartDataSourceChart(type?: string): Promise<Chart | any> {
    return this.statsService.getHeartTypeDataFitbitLine(this.filter).then(
      (stats) => {

        let  outOfRange_minutes = 0, fatBurn_minutes = 0, cardio_minutes = 0;
        let i;
        for (i = 0; i < stats.length; i++) {

          if (stats[i].outOfRange_minutes) {
            outOfRange_minutes = outOfRange_minutes + stats[i].outOfRange_minutes;
          }
          if (stats[i].fatBurn_minutes) {
            fatBurn_minutes = fatBurn_minutes + stats[i].fatBurn_minutes;
          }
          if (stats[i].cardio_minutes) {
            cardio_minutes = cardio_minutes + stats[i].cardio_minutes;
          }
        }

        const hearts = [{name: 'outOfRange_minutes', value: outOfRange_minutes},
                        {name: 'fatBurn_minutes', value: fatBurn_minutes},
                        {name: 'cardio_minutes', value: cardio_minutes}];

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'pie'
            },
            title: {
              text: 'HEARTBEAT'
            },
            subtitle: {
              text: 'This graph shows the distribution of minutes of heartbeat'
            },
            credits: {
              enabled: false
            },
            series: [{
              data: hearts.map((stat) => ({name: stat.name, y: stat.value}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }

  /**
   * Build a line chart with the sleep data source type frequency.
   * @param type: the chart type.
   */
  private buildHeartDataSourceChartLine(type?: string): Promise<Chart | any> {
    return this.statsService.getHeartTypeDataFitbitLine(this.filter).then(
      (stats) => {


        const arrayData = [];
        let j;
        if (stats && stats.length > 0) {

          for (j = 0; j < stats.length; j++) {
            if (stats[j].timestamp) {
              arrayData.push(new Date(stats[j].timestamp).toDateString());
            }
          }
        }

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'HEART'
            },
            subtitle: {
              text: 'This graph shows the trend of the heartbeat'
            },
            xAxis: {
              title: {
                text: 'DATA'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'MINUTES HEART RATE'
              },
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Out Of Range Minutes',
              data: stats.map((stat) => ({name: 'outOfRange minutes', y: stat.outOfRange_minutes}))
            },
              {
                name: 'Fat Burn Minutes',
                data: stats.map((stat) => ({name: 'fatBurn minutes', y: stat.fatBurn_minutes}))
              },
              {
                name: 'Cardio Minutes',
                data: stats.map((stat) => ({name: 'cardio minutes', y: stat.cardio_minutes}))
              }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }


  private buildDiagnosisDataSourceChartBar(type?: string): Promise<Chart | any> {
    return this.statsService.getDiagnosisTypeDataTelegramBar(this.filter).then(
      (stats) => {         const arrayData = [];

        let j;
        if (stats && stats.length > 0) {

          for (j = 0; j < stats.length; j++) {
            if (stats[j].timestamp) {
              arrayData.push(stats[j].diagnosis_name);
            }
          }
        }

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'bar'
            },
            title: {
              text: 'DIAGNOSIS'
            },
            subtitle: {
              text: 'This graph shows diagnoses from HealthAssistantBot'
            },
            xAxis: {
              title: {
                text: 'NAME'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'diagnosis accuracy in %'
              },
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'diagnosis accuracy in %',
              data: stats.map((stat) => ({name: 'diagnosis accuracy', y: (stat.diagnosis_accuracy*100)}))
            }]
          });

          return Promise.resolve(chart);
        }
        
      },
      (err) => {
        this.chartsLoading = false;
      });
  }

  /**
   * Build a pie or bar chart with the heart data source type frequency.
   * @param type: the chart type.
   */
  private buildHeartDataSourceChartBar(type?: string): Promise<Chart | any> {
    return this.statsService.getHeartTypeDataFitbitLine(this.filter).then(
      (stats) => {

        let  outOfRange_minutes = 0, fatBurn_minutes = 0, cardio_minutes = 0;
        let i;
        for (i = 0; i < stats.length; i++) {

          if (stats[i].outOfRange_minutes) {
            outOfRange_minutes = outOfRange_minutes + stats[i].outOfRange_minutes;
          }
          if (stats[i].fatBurn_minutes) {
            fatBurn_minutes = fatBurn_minutes + stats[i].fatBurn_minutes;
          }
          if (stats[i].cardio_minutes) {
            cardio_minutes = cardio_minutes + stats[i].cardio_minutes;
          }
        }

        const hearts = [{name: 'outOfRange_minutes', value: outOfRange_minutes},
          {name: 'fatBurn_minutes', value: fatBurn_minutes},
          {name: 'cardio_minutes', value: cardio_minutes}];

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'bar'
            },
            title: {
              text: 'HEARTBEAT'
            },
            xAxis: {
              title: {
                text: 'TYPE OF BEAT'
              },
              categories: ['outOfRange_minutes', 'fatBurn_minutes', 'cardio_minutes']
            },
            yAxis: {
              title: {
                text: 'TOTAL MINUTES'
              },
            },
            subtitle: {
              text: 'This graph shows the distribution of minutes of heartbeat'
            },
            credits: {
              enabled: false
            }, plotOptions: {
              series: {
                color: '#ff6600'
              }
            },
            series: [{
              name: 'Minutes',
              data: hearts.map((stat) => ({name: stat.name, y: stat.value}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }


  /**
   * Build a line chart with the heart data source type frequency.
   * @param type: the chart type.
   */
  private buildHeartDataSourceChartBarRate(type?: string): Promise<Chart | any> {
    return this.statsService.getHeartTypeDataFitbitLine(this.filter).then(
      (stats) => {

        const arrayData = [];
        let j;
        if (stats && stats.length > 0) {

          for (j = 0; j < stats.length; j++) {
            if (stats[j].timestamp) {
              arrayData.push(new Date(stats[j].timestamp).toDateString());
            }
          }
        }

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'bar'
            },
            title: {
              text: 'HEART-RATE'
            },
            subtitle: {
              text: 'This graph shows the trend over time of heartbeat'
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'MINUTES OF HEART-RATE'
              },
            },
            plotOptions: {
              series: {
                color: '#ff6600'
              }
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Heart Rate',
              data: stats.map((stat) => ({name: 'Heart Rate', y: stat.restingHeartRate}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }



  /**
   * Build a line chart with the heart data source type frequency.
   * @param type: the chart type.
   */
  private buildHeartDataSourceChartBarPeak(type?: string): Promise<Chart | any> {
    return this.statsService.getHeartTypeDataFitbitLine(this.filter).then(
      (stats) => {

        const arrayData = [];
        let j;
        if (stats && stats.length > 0) {

          for (j = 0; j < stats.length; j++) {
            if (stats[j].timestamp) {
              arrayData.push(new Date(stats[j].timestamp).toDateString());
            }
          }
        }

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'bar'
            },
            title: {
              text: 'HEART-RATE PEAK'
            },
            subtitle: {
              text: 'This graph shows the trend over time of heartbeat'
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'MINUTES OF PEAK HEART-RATE'
              },
            },
            plotOptions: {
              series: {
                color: '#ff6600'
              }
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Peak',
              data: stats.map((stat) => ({name: 'Peak Heart Rate', y: stat.peak_minutes}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }



  /**
   * Build a line chart with the heart data source type frequency.
   * @param type: the chart type.
   */
  private buildHeartDataSourceChartLineRate(type?: string): Promise<Chart | any> {
    return this.statsService.getHeartTypeDataFitbitLine(this.filter).then(
      (stats) => {

        const arrayData = [];
        let j;
        if (stats && stats.length > 0) {

          for (j = 0; j < stats.length; j++) {
            if (stats[j].timestamp) {
              arrayData.push(new Date(stats[j].timestamp).toDateString());
            }
          }
        }

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'HEARTBEAT'
            },
            subtitle: {
              text: 'This graph shows the trend over time of heartbeat'
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'MINUTES OF HEART-RATE'
              },
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Heart Rate',
              data: stats.map((stat) => ({name: 'Heart Rate', y: stat.restingHeartRate}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }


  /**
   * Build a line chart with the heart data source type frequency.
   * @param type: the chart type.
   */
  private buildHeartDataSourceChartLinePeak(type?: string): Promise<Chart | any> {
    return this.statsService.getHeartTypeDataFitbitLine(this.filter).then(
      (stats) => {

        const arrayData = [];
        let j;
        if (stats && stats.length > 0) {

          for (j = 0; j < stats.length; j++) {
            if (stats[j].timestamp) {
              arrayData.push(new Date(stats[j].timestamp).toDateString());
            }
          }
        }

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'HEARTBEAT'
            },
            subtitle: {
              text: 'This graph shows the trend over time of heartbeat'
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'MINUTES OF PEAK HEART-RATE'
              },
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Peak',
              data: stats.map((stat) => ({name: 'Peak Heart Rate', y: stat.peak_minutes}))
            }]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }


  /**
   * Build a line chart with the body data source type frequency.
   * @param type: the chart type.
   */
  private buildBodyDataSourceChartLineWeight(type?: string): Promise<Chart | any> {
    return this.statsService.getBodyTypeDataFitbitLine(this.filter).then(
      (stats) => {


        const arrayData = [];
        let i;
        for (i = 1; i < ((stats.length / 3) + 2); i++) {

          arrayData.push(new Date(this.filter.dateFrom.setDate(this.filter.dateFrom.getDate() + 1)).toDateString());
        }


        stats = stats.filter(function( obj ) {
          return obj.nameBody !== 'fat';
        });
        stats = stats.filter(function( obj ) {
          return obj.nameBody !== 'BMI';
        });

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'WEIGHT'
            },
            subtitle: {
              text: 'This graph shows the trend of weight over time'
            },
            credits: {
              enabled: false
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'WEIGHT (Kg)'
              }
            },
            series: [{
              name: 'Weight',
              data: stats.map((stat) => ({name: 'Weight', y: stat.bodyWeight}))
            }
            ]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }


  private buildBodyDataSourceChartLineFat(type?: string): Promise<Chart | any> {
    return this.statsService.getBodyTypeDataFitbitLine(this.filter).then(
      (stats) => {


        const arrayData = [];
        let i;
        for (i = 1; i < ((stats.length / 3) + 2); i++) {

          arrayData.push(new Date(this.filter.dateFrom.setDate(this.filter.dateFrom.getDate() + 1)).toDateString());
        }

        stats = stats.filter(function( obj ) {
          return obj.nameBody !== 'BMI';
        });
        stats = stats.filter(function( obj ) {
          return obj.nameBody !== 'weight';
        });

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'FAT'
            },
            subtitle: {
              text: 'This graph shows the trend of FAT over time'
            },
            credits: {
              enabled: false
            },
            yAxis: {
              title: {
                text: 'FAT VALUE'
              }
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            series: [
              {
                name: 'Fat',
                data: stats.map((stat) => ({name: 'Fat', y: stat.bodyFat}))
              }
            ]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }


  private buildBodyDataSourceChartLineBMI(type?: string): Promise<Chart | any> {
    return this.statsService.getBodyTypeDataFitbitLine(this.filter).then(
      (stats) => {

        const arrayData = [];
        let i;
        for (i = 1; i < ((stats.length / 3) + 2); i++) {

          arrayData.push(new Date(this.filter.dateFrom.setDate(this.filter.dateFrom.getDate() + 1)).toDateString());

        }

        stats = stats.filter(function( obj ) {
          return obj.nameBody !== 'fat';
        });
        stats = stats.filter(function( obj ) {
          return obj.nameBody !== 'weight';
        });

        this.chartsLoading = false;

        if (stats && stats.length > 0) {

          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'BMI'
            },
            subtitle: {
              text: 'This graph shows the trend of BMI over time'
            },
            credits: {
              enabled: false
            },
            yAxis: {
              title: {
                text: 'BMI VALUE'
              }
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            series: [
              {
                name: 'BMI',
                data: stats.map((stat) => ({name: 'Bmi', y: stat.bodyBmi}))
              },
            ]
          });

          return Promise.resolve(chart);
        }
      },
      (err) => {
        this.chartsLoading = false;
      });
  }




  clickedMarker(marker: any) {
    // console.log(marker);
    let message;
    const toConvert = new Date(marker.date);
    message = 'Text: ' + marker.text + '\nDate: ' + toConvert.toLocaleDateString() ;
    this.openInfoDialog(message);
  }


  /**
   * Open a dialog with information about data source.
   * @param info: the info message
   */
  openInfoDialog(info: string) {
    this.dialog.open(InfoDialogComponent, {
      data: {infoText: info},
    });
  }

  getTelegramAnalysis(numberToRead: Number){
    this.telegramService.userAnalyses(numberToRead).subscribe(
      (res) => {
        if (res.analysis && res.analysis.length > 0) {
            this.analyses = res.analysis;

          } 
         
      },
      (err) => {
       
      });

  }
  getTelegramMedicalArea(numberToRead: Number){
    this.telegramService.userMedicalArea(numberToRead).subscribe(
      (res) => {
        if (res.medicalArea && res.medicalArea.length > 0) {
            this.medicalArea = res.medicalArea;

          } 
         
      },
      (err) => {
       
      });

  }

  deleteAnalysisDuplicate(){
    var i = 0;
    var j;
    var rep = this.analyses.length-1;
    
  try{
    while(i< rep){
      j= i+1
      while(j<= rep){
        if(this.analyses[i].analysisName === this.analyses[j].analysisName){
          this.analyses.splice(i, 1);
          rep--;
          }
          j++;

      }
      i++;
    }
  }catch(e){
    this.toast.success(e);
  }
  
   
  }

  private buildAnalysisDataSourceChartLine(type?: string): Promise<Chart | any> {
    return this.statsService.getAnalysisTypeDataTelegramLine(this.filter).then(
      (stats) => {
       
        


        const arrayData = [];
        let j;
        if (stats && stats.length > 0) {

          for (j = 0; j < stats.length; j++) {
            if (stats[j].timestamp) {
              arrayData.push(new Date(stats[j].timestamp).toDateString());
            }
          }
        
        }


        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'ANALYSIS'
            },
            subtitle: {
              text: 'This chart shows '+ stats[0].analysisName+ "'s analysis data"
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            yAxis: {
              title: {
                text: 'RESULT VALUE IN '+ stats[0].unit
              },
            },
            plotOptions: {
              series: {
                color: '#ff6600'
              }
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Result',
              data: stats.map((stat) => ({name: 'Result', y: stat.result}))
            }]
          });

          return Promise.resolve(chart);
        }
        

        
      },
      (err) => {
        this.chartsLoading = false;
      });
  }


  private buildTherapyDataSourceTable(type?: string): Promise<Chart | any> {
    return this.statsService.getTherapyTypeDataTelegramTable(this.filter).then(
      (stats) => {    
        this.therapy = stats;
        
      },
      (err) => {
        this.chartsLoading = false;
      });
  }

  private buildMedicalVisitDataSourceTable(type?: string): Promise<Chart | any> {
    return this.statsService.getMedicalVisitTypeDataTelegramTable(this.filter).then(
      (stats) => {    
        this.medicalVisit = stats;
        
      },
      (err) => {
        this.chartsLoading = false;
      });
  }


  private buildDiseaseDataSourceTable(type?: string): Promise<Chart | any> {
    return this.statsService.getDiseaseTypeDataTelegramTable(this.filter).then(
      (stats) => {    
        this.disease = stats;
        
      },
      (err) => {
        this.chartsLoading = false;
      });
  }


  private buildHospitalizationDataSourceTable(type?: string): Promise<Chart | any> {
    return this.statsService.getHospitalizationTypeDataTelegramTable(this.filter).then(
      (stats) => {    
        this.hospitalization = stats;
        
      },
      (err) => {
        this.chartsLoading = false;
      });
  }

}

