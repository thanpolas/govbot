/**
 * @fileoverview Fixtures for twitter API.
 */

const fix = (module.exports = {});

fix.tweetResponseFix = () => {
  return {
    created_at: 'Wed Aug 25 14:16:50 +0000 2021',
    id: 1430534637143605200,
    id_str: '1430534637143605252',
    text: '📢 Proposal "Temp Check: Larger Grant Construct // CEA + No Negative Net UNI" ACTIVE on Snapshot https://t.co/XxVl2UUYIq',
    truncated: false,
    entities: {
      hashtags: [],
      symbols: [],
      user_mentions: [],
      urls: [[Object]],
    },
    source:
      '<a href="https://help.twitter.com/en/using-twitter/how-to-tweet#source-labels" rel="nofollow">polas-test</a>',
    in_reply_to_status_id: null,
    in_reply_to_status_id_str: null,
    in_reply_to_user_id: null,
    in_reply_to_user_id_str: null,
    in_reply_to_screen_name: null,
    user: {
      id: 1047188248446099500,
      id_str: '1047188248446099456',
      name: 'Test Moveon',
      screen_name: 'MoveonTest',
      location: '',
      description: '',
      url: null,
      entities: { description: [Object] },
      protected: false,
      followers_count: 0,
      friends_count: 0,
      listed_count: 0,
      created_at: 'Tue Oct 02 18:15:09 +0000 2018',
      favourites_count: 1,
      utc_offset: null,
      time_zone: null,
      geo_enabled: false,
      verified: false,
      statuses_count: 3,
      lang: null,
      contributors_enabled: false,
      is_translator: false,
      is_translation_enabled: false,
      profile_background_color: '000000',
      profile_background_image_url:
        'http://abs.twimg.com/images/themes/theme1/bg.png',
      profile_background_image_url_https:
        'https://abs.twimg.com/images/themes/theme1/bg.png',
      profile_background_tile: false,
      profile_image_url:
        'http://pbs.twimg.com/profile_images/1430525449579401220/seLMDTtp_normal.jpg',
      profile_image_url_https:
        'https://pbs.twimg.com/profile_images/1430525449579401220/seLMDTtp_normal.jpg',
      profile_link_color: '27AAC4',
      profile_sidebar_border_color: '000000',
      profile_sidebar_fill_color: '000000',
      profile_text_color: '000000',
      profile_use_background_image: false,
      has_extended_profile: false,
      default_profile: false,
      default_profile_image: false,
      following: false,
      follow_request_sent: false,
      notifications: false,
      translator_type: 'none',
      withheld_in_countries: [],
    },
    geo: null,
    coordinates: null,
    place: null,
    contributors: null,
    is_quote_status: false,
    retweet_count: 0,
    favorite_count: 0,
    favorited: false,
    retweeted: false,
    possibly_sensitive: false,
    lang: 'en',
  };
};
