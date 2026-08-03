import { ResolveFn } from '@angular/router';

export const stationsListTitleResolver: ResolveFn<string> = route => {
  const action = route.queryParamMap.get('action');

  if (!action) return 'Stations';

  return action?.charAt(0).toUpperCase() + action?.slice(1) + ' Station';
};
