import {Component, OnInit} from '@angular/core';
import {StatsService} from '../../../services/stats.service';
import {Chart} from 'angular-highcharts';

@Component({
  selector: 'app-people-demographics',
  styleUrls: ['./../people.component.scss'],
  templateUrl: './people-demographics.component.html'
})
export class PeopleDemographicsComponent implements OnInit {

  /**
   * Demographics data chars.
   */
  charts: {chart: Chart, name: String, description: String}[] = [];

  constructor(
    private statsService: StatsService
  ) {}

  ngOnInit() {

    this.statsService.getDemographicsLocationStats().then((res) => {
      if (res) {
        this.buildChart(res, 'Location', '');
      }
    });

    this.statsService.getDemographicsGenderStats().then((res) => {
      if (res) {
        this.buildChart(res, 'Gender', '');
      }
    });

    this.statsService.getDemographicsLanguageStats().then((res) => {
      if (res) {
        this.buildChart(res, 'Language', '');
      }
    });
  }

  private buildChart(response: any, name: string, description: string) {
    const stats = [];
    for (const key in response) {
      if (response.hasOwnProperty(key)) {
        stats.push({
          name: key,
          y: response[key],
        });
      }
    }
    if (stats.length > 0) {
      const chart = new Chart({
        chart: {
          type: 'pie'
        },
        title: null,
        credits: {
          enabled: false
        },
        series: [{
          data: stats
        }]
      });
      this.charts.push({chart: chart, name: name, description: description});
    }
  }

}
