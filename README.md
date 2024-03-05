# Image api for the project

### Api description

Api allows performing CRUD operations on images. It is possible to upload, delete, get and list images.

## Localstack

Localstack is used to run the application locally. It is a fully functional local AWS cloud stack. It is used to run the
application locally and to test the application.

### Running the application locally

1. Create mongodb container

```shell
docker-compose up
```

2. Run localstack

```shell
localstack start
```

3. Bootstrap localstack

```shell
cdklocal bootstrap --profile localstack
```

4. Deploy the application

```shell
cdklocal deploy --profile localstack
```

## Deploying the application

```shell
cdk deploy --profile <profile> --all
```