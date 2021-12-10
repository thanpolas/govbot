/**
 * @fileoverview Discourse webhook payloads fixtures.
 */

exports.discourseHeadersFix = () => {
  return {
    'X-Discourse-Instance': 'https://gov.uniswap.org',
    'X-Discourse-Event-Id': 3,
    'X-Discourse-Event-Type': 'topic',
    'X-Discourse-Event': 'topic_created',
    'X-Discourse-Event-Signature':
      'sha256=07f62688203bda085e48eab1aeb6d668234a5d6c10678cd5092241523a150222',
  };
};

exports.discourseHeadersArFix = () => {
  return [
    ['X-Discourse-Instance', 'https://gov.uniswap.org'],
    ['X-Discourse-Event-Id', 3],
    ['X-Discourse-Event-Type', 'topic'],
    ['X-Discourse-Event', 'topic_created'],
    [
      'X-Discourse-Event-Signature',
      'sha256=07f62688203bda085e48eab1aeb6d668234a5d6c10678cd5092241523a150222',
    ],
  ];
};

exports.discourseRawFix = () => {
  return '{"topic":{"tags_descriptions":{},"id":15408,"title":"Another one to ignore - testing only","fancy_title":"Another one to ignore - testing only","posts_count":1,"created_at":"2021-12-06T17:29:33.340Z","views":0,"reply_count":0,"like_count":0,"last_posted_at":"2021-12-06T17:29:33.399Z","visible":true,"closed":false,"archived":false,"archetype":"regular","slug":"another-one-to-ignore-testing-only","category_id":1,"word_count":6,"deleted_at":null,"user_id":10151,"featured_link":null,"pinned_globally":false,"pinned_at":null,"pinned_until":null,"unpinned":null,"pinned":false,"highest_post_number":1,"deleted_by":null,"has_deleted":false,"bookmarked":false,"participant_count":1,"queued_posts_count":0,"thumbnails":null,"created_by":{"id":10151,"username":"thanpolas","name":"Thanos","avatar_template":"/user_avatar/gov.uniswap.org/thanpolas/{size}/3979_2.png"},"last_poster":{"id":10151,"username":"thanpolas","name":"Thanos","avatar_template":"/user_avatar/gov.uniswap.org/thanpolas/{size}/3979_2.png"},"tags_disable_ads":false,"discourse_zendesk_plugin_zendesk_id":null,"discourse_zendesk_plugin_zendesk_url":"https://your-url.zendesk.com/agent/tickets/","pending_posts":[]}}';
};

exports.discourseFix = () => {
  return {
    topic: {
      tags_descriptions: {},
      id: 15408,
      title: 'Another one to ignore - testing only',
      fancy_title: 'Another one to ignore - testing only',
      posts_count: 1,
      created_at: '2021-12-06T17:29:33.340Z',
      views: 0,
      reply_count: 0,
      like_count: 0,
      last_posted_at: '2021-12-06T17:29:33.399Z',
      visible: true,
      closed: false,
      archived: false,
      archetype: 'regular',
      slug: 'another-one-to-ignore-testing-only',
      category_id: 1,
      word_count: 6,
      deleted_at: null,
      user_id: 10151,
      featured_link: null,
      pinned_globally: false,
      pinned_at: null,
      pinned_until: null,
      unpinned: null,
      pinned: false,
      highest_post_number: 1,
      deleted_by: null,
      has_deleted: false,
      bookmarked: false,
      participant_count: 1,
      queued_posts_count: 0,
      thumbnails: null,
      created_by: {
        id: 10151,
        username: 'thanpolas',
        name: 'Thanos',
        avatar_template:
          '/user_avatar/gov.uniswap.org/thanpolas/{size}/3979_2.png',
      },
      last_poster: {
        id: 10151,
        username: 'thanpolas',
        name: 'Thanos',
        avatar_template:
          '/user_avatar/gov.uniswap.org/thanpolas/{size}/3979_2.png',
      },
      tags_disable_ads: false,
      discourse_zendesk_plugin_zendesk_id: null,
      discourse_zendesk_plugin_zendesk_url:
        'https://your-url.zendesk.com/agent/tickets/',
      pending_posts: [],
    },
  };
};
