import {Component, Input, OnInit} from '@angular/core';
import {StatsService} from '../../../../services/stats.service';
import {CloudData, CloudOptions, ZoomOnHoverOptions} from 'angular-tag-cloud-module';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-profile-interests',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-interest.component.html'
})
export class ProfileDataInterestComponent implements OnInit {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

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
    id: 'news_preference',
    name: 'News',
  },{
    id: 'music_preference',
    name: 'Music',
  },{
    id: 'training_preference',
    name: 'Training',
  },{
    id: 'tv_preference',
    name: 'Tv Programs',
  },{
    id: 'video_preference',
    name: 'Video',
  },{
    id: 'recipe_preference',
    name: 'Recipes',
  },

    // TODO add here new source type
  ];

  /**
   * Filter available.
   */
  filter = {
    dateFrom: new Date(),
    dateTo: new Date(),
    source: this.sources[4].id,
  };

  /**
   * Application name.
   */
  appName = environment.appName;

  constructor(
    private statsService: StatsService,
  ) {}

  /**
   * @override
   */
  ngOnInit() {
    /*Imposto la data di partenza a inizio mese*/
    this.filter.dateFrom.setDate(1);
    /*Imposto la data di fine al giorno dopo di quello corrente*/
    this.filter.dateTo.setDate(this.filter.dateTo.getDate() + 1);
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
