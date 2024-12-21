export interface TrendingImagesProps {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
  description: string;
  links: {
    download: string;
    html: string;
  }
}