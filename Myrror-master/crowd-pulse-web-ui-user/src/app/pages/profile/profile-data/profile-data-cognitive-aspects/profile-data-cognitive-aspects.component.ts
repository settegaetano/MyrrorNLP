import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-profile-cognitive-aspects',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-cognitive-aspects.component.html'
})
export class ProfileDataCognitiveAspectsComponent implements OnInit {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

  /**
   * User empathy.
   */
  empathy: string;

  // data source containing user personality data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];

  /**
   * @override
   */
  ngOnInit(): void {
    const personalities = this.user.personalities;

    if (personalities && personalities.length) {
      const personalitiesData: {dataName: string, dataValue: any}[] = [];
      const currentPersonality = personalities.sort((a, b) => b.timestamp - a.timestamp)[0];

      // we have the data
      if (currentPersonality.openness
        && currentPersonality.conscientiousness
        && currentPersonality.extroversion
        && currentPersonality.agreeableness
        && currentPersonality.neuroticism) {

        personalitiesData.push({dataName: 'openness', dataValue: currentPersonality.openness.toFixed(2)});
        personalitiesData.push({dataName: 'conscientiousness', dataValue: currentPersonality.conscientiousness.toFixed(2)});
        personalitiesData.push({dataName: 'extroversion', dataValue: currentPersonality.extroversion.toFixed(2)});
        personalitiesData.push({dataName: 'agreeableness', dataValue: currentPersonality.agreeableness.toFixed(2)});
        personalitiesData.push({dataName: 'neuroticism', dataValue: currentPersonality.neuroticism.toFixed(2)});
        this.dataSource = new MatTableDataSource(personalitiesData);
      }
    }

    if (this.user.empathies && this.user.empathies.length) {
      const empathyValue = this.user.empathies.sort((a, b) => b.timestamp - a.timestamp)[0].value;
      this.empathy = 'medium';
      if (empathyValue <= 0.3) {
        this.empathy = 'low';
      } else if (empathyValue > 0.7) {
        this.empathy = 'high';
      }
    }
  }

}
