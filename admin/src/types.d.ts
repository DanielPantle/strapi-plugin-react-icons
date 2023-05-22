interface IIconLibrary {
  id: string;
  name: string;
  abbreviation: string;
  isEnabled: boolean;
}

interface IReactIconsSelector {
  description: null | MessageDescriptor;
  intlLabel: null | MessageDescriptor;
  placeholder: null | MessageDescriptor;
  name: string;
  error: string;
  required: boolean;
  onChange: any;
  value: string;
}

interface IIconComponent {
  icon: string;
  size?: number;
}