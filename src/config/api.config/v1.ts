import { createCircleApi } from '@/modules/circle/helper';
import { Configure } from '@/modules/config/configure';
import { createContentApi } from '@/modules/content/helpers';
import { VersionOption } from '@/modules/restful/types';
import { createUserApi } from '@/modules/user/helpers';

import { createCollectApi } from '../../modules/collect/helper';
import { createCommentApi } from '../../modules/comment/helper';
import { createCourseApi } from '../../modules/course/helper';
import { createFeedApi } from '../../modules/feed/helper';
import { createPostApi } from '../../modules/post/helper';

export const v1 = async (configure: Configure): Promise<VersionOption> => {
    const userApi = createUserApi();
    const contentApi = createContentApi();
    const circleApi = createCircleApi();
    const collectApi = createCollectApi();
    const commentApi = createCommentApi();
    const courseApi = createCourseApi();
    const feedApi = createFeedApi();
    const postApi = createPostApi();
    return {
        routes: [
            {
                name: 'app',
                path: '/',
                controllers: [],
                doc: {
                    title: '应用接口',
                    description: '前端APP应用接口',
                    tags: [...contentApi.tags.app, ...userApi.tags.app, ...circleApi.tags.app],
                },
                children: [
                    ...contentApi.routes.app,
                    ...userApi.routes.app,
                    ...circleApi.routes.app,
                    ...collectApi.routes.app,
                    ...commentApi.routes.app,
                    ...courseApi.routes.app,
                    ...feedApi.routes.app,
                    ...postApi.routes.app,
                ],
            },
        ],
    };
};
