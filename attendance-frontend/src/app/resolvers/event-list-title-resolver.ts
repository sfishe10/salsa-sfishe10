import { ResolveFn } from '@angular/router';

export const eventListTitleResolver: ResolveFn<string> = route => {
  const type = route.queryParamMap.get('type');

  if (!type) return 'Events';

  return type?.charAt(0).toUpperCase() + type?.slice(1) + ' Events';
};
