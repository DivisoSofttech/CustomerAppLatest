import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueryResourceService } from 'src/app/api/services';
import { Term, SubTerm } from 'src/app/api/models';

@Component({
  selector: 'app-terms-and-policy',
  templateUrl: './terms-and-policy.component.html',
  styleUrls: ['./terms-and-policy.component.scss'],
})
export class TermsAndPolicyComponent implements OnInit {

  public showLoading = true;

  public terms: Term[] = [];

  public subterms:Map<Number,SubTerm[]> = new Map<Number,SubTerm[]>()

  constructor(
    private queryResourceService: QueryResourceService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.fetchTermsAndPolicies(0);
  }

  private fetchTermsAndPolicies(i) {
    this.queryResourceService.findalltermsUsingGET({
      page:i
    }).subscribe(pageofterms=> {
      this.showLoading = false;
      pageofterms.content.forEach(term=> {
        this.terms.push(term);
        this.fetchSubTerms(term.id);
      })
      i++;
      if(i <pageofterms.totalPages ) {
        this.fetchTermsAndPolicies(i)
      }
    },
    err=> {
      this.showLoading = false;
    })
  }

  private fetchSubTerms(id) {
    this.queryResourceService.getSubTermsByTermIdUsingGET(id)
    .subscribe(subterm=> {
      this.subterms.set(id,subterm);
    });
  }

  public dismiss() {
    this.modalController.dismiss();
  }

}
