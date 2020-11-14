import {Component, Input} from '@angular/core';
import {StatsService} from '../../../services/stats.service';
import {Chart} from 'angular-highcharts';

@Component({
  selector: 'app-people-affects',
  styleUrls: ['./../people.component.scss'],
  templateUrl: './people-affects.component.html'
})
export class PeopleAffectsComponent {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

  /**
   * User affects data (the sentiment/emotions shown as timeline).
   */
  data: any;

  /**
   * Mood/emotion timeline chart.
   */
  chart: Chart;

  /**
   * Filter available.
   */
  filter = {
    dateFrom: new Date(),
    dateTo: new Date(),
    global: true,
  };

  /**
   * Available affect types.
   */
  types = [{
    id: null,
    name: 'None',
  }, {
    id: 'mood',
    name: 'Mood',
  }, {
    id: 'emotions',
    name: 'Emotions',
  }];

  /**
   * Selected affect type.
   */
  selectedType: {id: string, name: string};

  /**
   * User emotions.
   */
  emotions: any;


  constructor(
    private statsService: StatsService,
  ) {}

  /**
   * Update the selected chart.
   */
  updateChart() {
    switch (this.selectedType.id) {

      case 'mood':
        this.statsService.getSentimentTimelineStats(this.filter).then(
          (res) => {
            this.data = res;
            this.mapSentimentStatToTimeline(res);
            this.buildChart(this.selectedType.name);
          }
        );
        break;

      case 'emotions':
        this.statsService.getEmotionTimelineStats(this.filter).then(
          (res) => {
            this.data = res;
            this.mapEmotionStatToTimeline(res);
            this.buildChart(this.selectedType.name);
          }
        );
        break;

      default:
        this.data = null;
        break;
    }
  }

  /**
   * Convert sentiment stats result to timeline array for correct visualization.
   * @param stats: the sentiment stats
   */
  private mapSentimentStatToTimeline(stats) {
    this.data = [];
    stats.forEach((stat) => {
      let color = '#000000';
      if (stat.name === 'positive') {
        color = '#73E639';
      } else if (stat.name === 'negative') {
        color = '#E63939';
      }

      // override stat element
      stat = {
        name: stat.name,
        data: stat.values.map(function(elem) {
          return [(new Date(elem.date)).getTime(), elem.value];
        }),
        color: color
      };

      this.data.push(stat);
    });
  }

  /**
   * Convert emotion stats result to timeline array for correct visualization.
   * @param stats: the emotion stats
   */
  private mapEmotionStatToTimeline(stats) {
    this.data = [];
    stats.forEach((stat) => {
      let color = '#535353';
      if (stat.name === 'joy') {
        color = '#e6e44b';
      } else if (stat.name === 'anger') {
        color = '#b10000';
      } else if (stat.name === 'fear') {
        color = '#151741';
      } else if (stat.name === 'disgust') {
        color = '#865809';
      } else if (stat.name === 'surprise') {
        color = '#00e68b';
      }

      // override stat element
      stat = {
        name: stat.name,
        data: stat.values.map(function(elem) {
          return [(new Date(elem.date)).getTime(), elem.value];
        }),
        color: color
      };

      this.data.push(stat);
    });
  }

  /**
   * Build the chart.
   * @param yAxisText: the y-axis title
   */
  private buildChart(yAxisText: string) {
    this.chart = new Chart({
      chart: {
        type: 'spline',
      },
      title: null,
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          month: '%e. %b',
          year: '%b'
        },
        title: {
          text: 'Date'
        }
      },
      yAxis: {
        title: {
          text: yAxisText
        }
      },
      credits: {
        enabled: false
      },
      exporting: {
        buttons: {
          contextButton: {
            enabled: false
          }
        }
      },
      legend: {
        enabled: false
      },
      series: this.data
    });
  }

}
