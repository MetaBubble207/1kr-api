import { RouteOption, TagOption } from '../restful/types';

import * as controllers from './controllers';

export const createCourseApi = () => {
    const routes: Record<'app', RouteOption[]> = {
        app: [
            {
                name: 'app.course',
                path: '',
                controllers: Object.values(controllers),
            },
        ],
    };
    const tags: Record<'app', (string | TagOption)[]> = {
        app: [{ name: '课程', description: '课程相关接口' }],
    };
    return { routes, tags };
};
