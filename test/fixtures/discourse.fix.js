/**
 * @fileoverview Discourse webhook payloads fixtures.
 */

exports.discourseHeadersFix = () => {
  return {
    'X-Discourse-Instance': 'https://gov.uniswap.org',
    'X-Discourse-Event-Id': 1,
    'X-Discourse-Event-Type': 'topic',
    'X-Discourse-Event': 'topic_created',
    'X-Discourse-Event-Signature':
      'sha256=3408380dff98aa1edcad0abafda6674d06f813393b184d945e07f35d7764f638',
  };
};

exports.discourseHeadersArFix = () => {
  return [
    ['X-Discourse-Instance', 'https://gov.uniswap.org'],
    ['X-Discourse-Event-Id', 1],
    ['X-Discourse-Event-Type', 'topic'],
    ['X-Discourse-Event', 'topic_created'],
    [
      'X-Discourse-Event-Signature',
      'sha256=3408380dff98aa1edcad0abafda6674d06f813393b184d945e07f35d7764f638',
    ],
  ];
};

exports.discourseFix = () => {
  return {
    instance: 'https://gov.uniswap.org',
    topic: {
      tags_descriptions: {},
      id: 15407,
      title: 'Test ignore - will delete ASAP',
      fancy_title: 'Test ignore - will delete ASAP',
      posts_count: 1,
      created_at: '2021-12-06T16:21:53.761Z',
      views: 0,
      reply_count: 0,
      like_count: 0,
      last_posted_at: '2021-12-06T16:21:53.825Z',
      visible: true,
      closed: false,
      archived: false,
      archetype: 'regular',
      slug: 'test-ignore-will-delete-asap',
      category_id: 1,
      word_count: 22,
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
