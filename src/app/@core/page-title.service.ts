import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class PageTitleService {
  private readonly defaultTitle;

  constructor(private bodyTitle: Title) {
    this.defaultTitle = bodyTitle.getTitle() || 'SIG';
  }

  public setTitle(breadcrumbs: Map<string, string>) {
    // this.bodyTitle.setTitle(
    //   `${Array.from(breadcrumbs.keys())
    //     .reverse()
    //     .join(' | ')} | ${this.defaultTitle}`
    // );

    const list = Array.from(breadcrumbs.keys()).reverse();
    let title = this.defaultTitle;
    if (list.length > 0) title = list[0] == 'SIG' ? 'SIG' : `${list[0]} | SIG`;
    this.bodyTitle.setTitle(title);
  }
}
