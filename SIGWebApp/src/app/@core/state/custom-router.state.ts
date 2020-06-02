import { Params, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { RouterStateSerializer } from '@ngxs/router-plugin';

// export interface RouterStateParams {
//   url: string;
//   params: Params;
//   queryParams: Params;
// }
// // Map the router snapshot to { url, params, queryParams }
// export class CustomRouterStateSerializer
//   implements RouterStateSerializer<RouterStateParams> {
//   serialize(routerState: RouterStateSnapshot): RouterStateParams {
//     const {
//       url,
//       root: { queryParams }
//     } = routerState;
//     let { root: route } = routerState;
//     while (route.firstChild) {
//       route = route.firstChild;
//     }
//     const { params } = route;
//     return { url, params, queryParams };
//   }
// }

export interface RouterStateData {
  url: string;
  params: Params;
  queryParams: Params;
  breadcrumbs: Map<string, string>;
  data: any;
}

const flatMap = (f, arr: any[]) => arr.reduce((x, y) => [...x, ...f(y)], []);

// Map the router snapshot to { url, params, queryParams, titleSet }
export class CustomRouterStateSerializer
  implements RouterStateSerializer<RouterStateData> {
  serialize(routerState: RouterStateSnapshot): RouterStateData {
    const {
      url,
      root: { queryParams }
    } = routerState;
    let { root: route } = routerState;

    const breadcrumbs = new Map();

    while (route.firstChild) {
      route = route.firstChild;
      if (route.data['title']) {
        breadcrumbs.set(
          route.data['title'],
          flatMap(segment => segment.url, route.pathFromRoot).join('/')
          // route.pathFromRoot.flatMap(segment => segment.url).join('/')
        );
      }
    }
    const { params } = route;
    const { data } = route;
    return { url, params, queryParams, breadcrumbs, data };
  }
}
