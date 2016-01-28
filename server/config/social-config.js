ServiceConfiguration.configurations.remove({
  service: 'facebook'
});

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

if (process.env.NODE_ENV == 'development') {
  ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '902749736499448',
    secret: 'ebc93f53710707af82274578c747e947'
  });
} else {
  ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '902745083166580',
    secret: 'c95c3b0b7b7aee444b807595b45a7cd0'
  });
}
