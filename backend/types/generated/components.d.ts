import type { Schema, Struct } from '@strapi/strapi';

export interface DiplomaVersion extends Struct.ComponentSchema {
  collectionName: 'components_diploma_versions';
  info: {
    description: 'One language version of a diploma image';
    displayName: 'Version';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    language: Schema.Attribute.Relation<
      'oneToOne',
      'api::diploma-language.diploma-language'
    >;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social link';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['instagram', 'facebook', 'linkedin', 'tiktok', 'x']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'diploma.version': DiplomaVersion;
      'shared.social-link': SharedSocialLink;
    }
  }
}
