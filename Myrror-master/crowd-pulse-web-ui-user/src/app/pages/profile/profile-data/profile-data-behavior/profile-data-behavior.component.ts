import {Component, Input, OnInit} from '@angular/core';
import {StatsService} from '../../../../services/stats.service';
import {environment} from '../../../../../environments/environment';
import {InfoDialogComponent} from '../../../../components/info-dialog/info-dialog.component';
import {MatDialog} from '@angular/material';
import {Chart} from 'angular-highcharts';

@Component({
  selector: 'app-profile-behavior',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-behavior.component.html'
})
export class ProfileDataBehaviorComponent implements OnInit {

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
   * For UI progress spinner, true if charts are loading.
   */
  chartsLoading: boolean;

  /**
   * Available behavior source.
   */
  types = [ {
    id: 'location',
    name: 'Places',
  }, {
    id: 'activity',
    name: 'Activities',
  },
  ];


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
  },
  ];




  /**
   * Selected type.
   */
  selectedType: {id: string, name: string};

  /**
   * Selected chart.
   */
  selectedChart: {id: string, name: string};

  /**
   * Filter available.
   */
  filter = {
    dateFrom: new Date(),
    dateTo: new Date(),
    type: this.types[1].id
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
    private dialog: MatDialog,
  ) {}

  /**
   * @override
   */
  ngOnInit(): void {

    /*Imposto la data di partenza a inizio mese*/
    this.filter.dateFrom.setDate(1);
    /*Imposto la data di fine al giorno dopo di quello corrente*/
    this.filter.dateTo.setDate(this.filter.dateTo.getDate() + 1);

    this.statsService.getMapStats(this.filter).then((stats) => {
      this.postsCoordinates = stats.map((data) => {
        return {
          text: data.text,
          latitude: data.latitude,
          longitude: data.longitude,
          date: data.date,
          fromUser: data.fromUser
        };
      });

      for (let i = this.postsCoordinates.length - 1; i >= 0; i--) {
        if (this.postsCoordinates[i].latitude == null) {
          this.postsCoordinates.splice(i, 1);
        }
      }
    });
  }






  /**
   * Build chart with filter value.
   */
  updateChart() {

    this.customChart = undefined;
    this.customChart2 = undefined;
    this.customChart3 = undefined;
    this.chartsLoading = true;
    switch (this.selectedType.id) {

      case 'location':
        this.statsService.getMapStats(this.filter).then((stats) => {
          this.postsCoordinates = stats.map((data) => {
            return {
              text: data.text,
              latitude: data.latitude,
              longitude: data.longitude,
              date: data.date,
              fromUser: data.fromUser
            };
          });

          for (let i = this.postsCoordinates.length - 1; i >= 0; i--) {
            if (this.postsCoordinates[i].latitude == null) {
              this.postsCoordinates.splice(i, 1);
            }
          }
        });
        break;
      case 'activity':
        if (this.selectedChart.id == 'line') {
          this.buildActivityDataSourceChartLine(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
          this.buildActivityDataSourceChartLineSteps(this.selectedChart.id).then((chart) => {
            this.customChart2 = chart;
          });
          this.buildActivityDataSourceChartLineCalories(this.selectedChart.id).then((chart) => {
            this.customChart3 = chart;
          });
        } else if (this.selectedChart.id == 'pie') {
            this.buildActivityDataSourceChartPie(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
              this.customChart2 = null;
              this.customChart3 = null;
          });
        } else if (this.selectedChart.id == 'bar') {
          this.buildActivityDataSourceChartBar(this.selectedChart.id).then((chart) => {
            this.customChart = chart;
          });
          this.buildActivityDataSourceChartBarSteps(this.selectedChart.id).then((chart) => {
            this.customChart2 = chart;
          });
          this.buildActivityDataSourceChartBarCalories(this.selectedChart.id).then((chart) => {
            this.customChart3 = chart;
          });
        }

        break;
      default:
        this.customChart = null;
        break;
    }

  }


  /**
   * Build a pie with the activity data source type frequency.
   * @param type: the chart type.
   */
  private buildActivityDataSourceChartPie(type?: string): Promise<Chart | any> {
    return this.statsService.getActivityTypeDataFitbitLine(this.filter).then(
      (stats) => {


        let i;

        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== 'distance';
        });

        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== 'steps';
        });


        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== 'floors';
        });

        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== 'elevation';
        });

        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== null;
        });

        const arrayMinutesVeryActive = [];
        let sumveryActive = 0, sumfairly = 0, summinutesSedentary = 0, summinutesLightlyActive = 0;

        for (i = 0; i < stats.length; i++) {

          if (stats[i].nameActivity == 'veryActive') {
            sumveryActive = sumveryActive + stats[i].minutesVeryActive;

          }
          if (stats[i].nameActivity == 'fairly') {
            sumfairly = sumfairly + stats[i].minutesFairlyActive;
          }
          if (stats[i].nameActivity == 'minutesSedentary') {
            summinutesSedentary = summinutesSedentary + stats[i].minutesSedentary;
          }
          if (stats[i].nameActivity == 'minutesLightlyActive') {
            summinutesLightlyActive = summinutesLightlyActive + stats[i].minutesLightlyActive;
          }

        }
        arrayMinutesVeryActive.push({name: 'MinutesVeryActive', value: sumveryActive},
          {name: 'MinutesFairly', value: sumfairly},
          {name: 'MinutesSedentary', value: summinutesSedentary},
          {name: 'MinutesLightlyActive', value: summinutesLightlyActive});

        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'pie'
            },
            title: {
              text: 'ACTIVITIES'
            },
            subtitle: {
              text: 'This graph shows the distribution of the minutes of the activities'
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Total minutes',
              data: arrayMinutesVeryActive.map((stat) => ({name: stat.name, y: stat.value}))
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
   * Build a bar with the activity data source type frequency.
   * @param type: the chart type.
   */
  private buildActivityDataSourceChartBar(type?: string): Promise<Chart | any> {
    return this.statsService.getActivityTypeDataFitbitLine(this.filter).then(
      (stats) => {

        let i;

        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== 'distance';
        });

        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== 'steps';
        });


        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== 'floors';
        });

        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== 'elevation';
        });

        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== null;
        });

        const arrayMinutesVeryActive = [];
        let sumveryActive = 0, sumfairly = 0, summinutesSedentary = 0, summinutesLightlyActive = 0;

        for (i = 0; i < stats.length; i++) {

          if (stats[i].nameActivity == 'veryActive') {
            sumveryActive = sumveryActive + stats[i].minutesVeryActive;

          }
          if (stats[i].nameActivity == 'fairly') {
            sumfairly = sumfairly + stats[i].minutesFairlyActive;
          }
          if (stats[i].nameActivity == 'minutesSedentary') {
            summinutesSedentary = summinutesSedentary + stats[i].minutesSedentary;
          }
          if (stats[i].nameActivity == 'minutesLightlyActive') {
            summinutesLightlyActive = summinutesLightlyActive + stats[i].minutesLightlyActive;
          }

        }
        arrayMinutesVeryActive.push({name: 'MinutesVeryActive', value: sumveryActive},
          {name: 'MinutesFairly', value: sumfairly},
          {name: 'MinutesSedentary', value: summinutesSedentary},
          {name: 'MinutesLightlyActive', value: summinutesLightlyActive});


        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'bar'
            },
            title: {
              text: 'ACTIVITIES'
            },
            subtitle: {
              text: 'This graph shows the distribution of the minutes of the activities'
            },
            yAxis: {
              title: {
                text: 'MINUTES OF ACTIVITY'
              },
            },
            xAxis: {
              title: {
                text: 'TYPE ACTIVITIES'
              },
              categories: ['MinutesVeryActive', 'MinutesFairly', 'MinutesSedentary', 'MinutesLightlyActive']
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Total minutes',
              data: arrayMinutesVeryActive.map((stat) => ({name: stat.name, y: stat.value}))
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
   * Build a bar with the activity data source type frequency.
   * @param type: the chart type.
   */
  private buildActivityDataSourceChartBarSteps(type?: string): Promise<Chart | any> {
    return this.statsService.getActivityTypeDataFitbitLineSteps(this.filter).then(
      (stats) => {

        const arrayData = [];
        let i;
        if (stats && stats.length > 0) {

          for (i = 0; i < stats.length; i++) {
            if (stats[i].timestamp) {
              arrayData.push(new Date(stats[i].timestamp).toDateString());
            }
          }
        }

        stats = stats.filter(function( obj ) {
          return obj.name !== 'fairly';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'distance';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'calories';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'veryActive';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'minutesLightlyActive';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'minutesSedentary';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'floors';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'elevation';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== null;
        });


        this.chartsLoading = false;
        if (stats && stats.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'bar'
            },
            title: {
              text: 'STEPS'
            },
            subtitle: {
              text: 'This graph shows the distribution of steps'
            },
            yAxis: {
              title: {
                text: 'NUMBER OF STEPS'
              },
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            plotOptions: {
              series: {
                color: '#1a75ff'
              }
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Total steps',
              data: stats.map((stat) => ({name: 'Steps', y: stat.steps}))
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
   * Build a bar with the activity data source type frequency.
   * @param type: the chart type.
   */
  private buildActivityDataSourceChartBarCalories(type?: string): Promise<Chart | any> {
    return this.statsService.getActivityTypeDataFitbitLineCalories(this.filter).then(
      (stats) => {


        stats = stats.filter(function( obj ) {
          return obj.name !== 'fairly';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'distance';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'steps';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'veryActive';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'minutesLightlyActive';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'minutesSedentary';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'floors';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== 'elevation';
        });

        stats = stats.filter(function( obj ) {
          return obj.name !== null;
        });

        const arrayData = [];

        let i;
        if (stats && stats.length > 0) {

          for (i = 0; i < stats.length; i++) {
            if (stats[i].timestamp) {
              arrayData.push(new Date(stats[i].timestamp).toDateString());
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
              text: 'CALORIES'
            },
            subtitle: {
              text: 'This graph shows the distribution of calories'
            },
            yAxis: {
              title: {
                text: 'NUMBER OF CALORIES'
              },
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'kcal',
              data: stats.map((stat) => ({name: 'Calories', y: stat.activityCalories}))
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
   * Build a line chart with the activity data source type frequency.
   * @param type: the chart type.
   */
  private buildActivityDataSourceChartLine(type?: string): Promise<Chart | any> {
    return this.statsService.getActivityTypeDataFitbitLine(this.filter).then(
      (stats) => {

        const arrayData = [];
        const date = new Date(this.filter.dateFrom);
        let i;
        if (stats && stats.length > 0) {

          for (i = 0; i < stats.length; i++) {

            arrayData.push(new Date(date.setDate(date.getDate() + 1)).toDateString());
          }
        }

        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== 'distance';
        });

        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== 'steps';
        });


        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== 'floors';
        });

        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== 'elevation';
        });

        stats = stats.filter(function( obj ) {
          return obj.nameActivity !== null;
        });

        const arrayMinutesVeryActive = [];
        const arrayMinutesFairlyActive = [];
        const arrayMinutesSedentary = [];
        const arrayMinutesLightlyActive = [];

        for (i = 0; i < stats.length; i++) {

          if (stats[i].nameActivity == 'veryActive') {

            arrayMinutesVeryActive.push({name: 'fairly', value: stats[i].minutesVeryActive});
          }
          if (stats[i].nameActivity == 'fairly') {

            arrayMinutesFairlyActive.push({name: 'fairly', value: stats[i].minutesFairlyActive});
          }
          if (stats[i].nameActivity == 'minutesSedentary') {

            arrayMinutesSedentary.push({name: 'fairly', value: stats[i].minutesSedentary});
          }
          if (stats[i].nameActivity == 'minutesLightlyActive') {

            arrayMinutesLightlyActive.push({name: 'fairly', value: stats[i].minutesLightlyActive});
          }

        }

        this.chartsLoading = false;
        if (arrayMinutesSedentary && arrayMinutesSedentary.length > 0) {
          const chart = new Chart({
            chart: {
              type: 'line'
            },
            title: {
              text: 'ACTIVITIES'
            },
            subtitle: {
              text: 'This graph shows the distribution of activity'
            },
            yAxis: {
              title: {
                text: 'MINUTES OF ACTIVITY'
              },
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Very Active',
              data: arrayMinutesVeryActive.map((stat) => ({name: 'Minutes Very Active', y: stat.value}))
            },
            {
              name: 'Fairly',
              data: arrayMinutesFairlyActive.map((stat) => ({name: 'Minutes Fairly', y: stat.value}))
            },
            {
              name: 'Minutes Sedentary',
              data: arrayMinutesSedentary.map((stat) => ({name: 'Minutes Sedentary', y: stat.value}))
            },
            {
              name: 'Minutes Lightly Active',
              data: arrayMinutesLightlyActive.map((stat) => ({name: 'Minutes Lightly Active', y: stat.value}))
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
   * Build a line chart with the activity data source type frequency.
   * @param type: the chart type.
   */
  private buildActivityDataSourceChartLineSteps(type?: string): Promise<Chart | any> {
    return this.statsService.getActivityTypeDataFitbitLineSteps(this.filter).then(
      (stats) => {

        const arrayData = [];

        let i;
        if (stats && stats.length > 0) {

          for (i = 0; i < stats.length; i++) {
            if (stats[i].timestamp) {
              arrayData.push(new Date(stats[i].timestamp).toDateString());
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
              text: 'ACTIVITIES'
            },
            subtitle: {
              text: 'This graph shows the distribution of steps'
            },
            yAxis: {
              title: {
                text: 'NUMBER OF STEPS'
              },
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Total steps',
              data: stats.map((stat) => ({name: 'Steps', y: stat.steps}))
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
   * Build a line chart with the activity data source type frequency.
   * @param type: the chart type.
   */
  private buildActivityDataSourceChartLineCalories(type?: string): Promise<Chart | any> {
    return this.statsService.getActivityTypeDataFitbitLineCalories(this.filter).then(
      (stats) => {


        const arrayData = [];
        let i;
        if (stats && stats.length > 0) {

          for (i = 0; i < stats.length; i++) {
            if (stats[i].timestamp) {
              arrayData.push(new Date(stats[i].timestamp).toDateString());
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
              text: 'ACTIVITIES'
            },
            subtitle: {
              text: 'This graph shows the distribution of steps'
            },
            yAxis: {
              title: {
                text: 'NUMBER OF CALORIES'
              },
            },
            xAxis: {
              title: {
                text: 'DATE'
              },
              categories: arrayData
            },
            credits: {
              enabled: false
            },
            series: [{
              name: 'Total kcal',
              data: stats.map((stat) => ({name: 'Calories', y: stat.activityCalories}))
            }]
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
}





