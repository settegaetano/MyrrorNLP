import {Component, OnInit} from '@angular/core';
import {StatsService} from '../../../services/stats.service';
import {CloudData, CloudOptions, ZoomOnHoverOptions} from 'angular-tag-cloud-module';

@Component({
  selector: 'app-people-interests',
  styleUrls: ['./../people.component.scss'],
  templateUrl: './people-interest.component.html'
})
export class PeopleInterestComponent implements OnInit {

  /**
   * WordCloud data.
   */
  data: CloudData[];

  /**
   * WordCloud options.
   */
  options: CloudOptions = {
    width : 1,
    height : 400,
    overflow: false,
  };

  /**
   * Zoom WordCloud option.
   */
  zoomOnHoverOptions: ZoomOnHoverOptions = {
    scale: 1.3,
    transitionTime: 0.5,
    delay: 0
  };

  /**
   * Available interest source.
   */
  sources = [{
    id: null,
    name: 'All',
  }, {
    id: 'message_token',
    name: 'Hashtags',
  }, {
    id: 'message_tag',
    name: 'Concepts',
  }, {
    id: 'message_tag_category',
    name: 'Topics',
  }, {
    id: 'like',
    name: 'Likes',
  }, {
    id: 'app_category',
    name: 'App Categories',
  }, {
    id: 'music_preference',
    name: 'Music',
  }, {
    id: 'training_preference',
    name: 'Workout',
  },
   {
    id: 'music_preference',
    name: 'Music',
  }

    // TODO add here new source type
  ];

  /**
   * Filter available.
   */
  filter = {
    dateFrom: new Date(),
    dateTo: new Date(),
    source: this.sources[4].id,
    global: true,
  };


  constructor(
    private statsService: StatsService,
  ) {}

  /**
   * @override
   */
  ngOnInit() {

    // get word cloud interests data
    this.statsService.getInterestsStats(this.filter).then((stats) => {
      this.data = stats.map((data) => {
        return {
          weight: data.weight,
          text: data.value,
        };
      });
    });
  }

  /**
   * Update chart with filter value.
   */
  updateChart() {
    this.statsService.getInterestsStats(this.filter).then((stats) => {
      this.data = stats.map((data) => {
        return {
          weight: data.weight,
          text: data.value,
        };
      });
    });
  }

}
