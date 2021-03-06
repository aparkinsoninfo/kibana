/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import * as t from 'io-ts';
import { setupRequest } from '../lib/helpers/setup_request';
import { getServiceAgentName } from '../lib/services/get_service_agent_name';
import { getServices } from '../lib/services/get_services';
import { getServiceTransactionTypes } from '../lib/services/get_service_transaction_types';
import { getServiceNodeMetadata } from '../lib/services/get_service_node_metadata';
import { createRoute } from './create_route';
import { uiFiltersRt, rangeRt } from './default_api_types';
import { getServiceAnnotations } from '../lib/services/annotations';

export const servicesRoute = createRoute(core => ({
  path: '/api/apm/services',
  params: {
    query: t.intersection([uiFiltersRt, rangeRt])
  },
  handler: async ({ context, request }) => {
    const setup = await setupRequest(context, request);
    const services = await getServices(setup);

    return services;
  }
}));

export const serviceAgentNameRoute = createRoute(() => ({
  path: '/api/apm/services/{serviceName}/agent_name',
  params: {
    path: t.type({
      serviceName: t.string
    }),
    query: rangeRt
  },
  handler: async ({ context, request }) => {
    const setup = await setupRequest(context, request);
    const { serviceName } = context.params.path;
    return getServiceAgentName(serviceName, setup);
  }
}));

export const serviceTransactionTypesRoute = createRoute(() => ({
  path: '/api/apm/services/{serviceName}/transaction_types',
  params: {
    path: t.type({
      serviceName: t.string
    }),
    query: rangeRt
  },
  handler: async ({ context, request }) => {
    const setup = await setupRequest(context, request);
    const { serviceName } = context.params.path;
    return getServiceTransactionTypes(serviceName, setup);
  }
}));

export const serviceNodeMetadataRoute = createRoute(() => ({
  path: '/api/apm/services/{serviceName}/node/{serviceNodeName}/metadata',
  params: {
    path: t.type({
      serviceName: t.string,
      serviceNodeName: t.string
    }),
    query: t.intersection([uiFiltersRt, rangeRt])
  },
  handler: async ({ context, request }) => {
    const setup = await setupRequest(context, request);
    const { serviceName, serviceNodeName } = context.params.path;
    return getServiceNodeMetadata({ setup, serviceName, serviceNodeName });
  }
}));

export const serviceAnnotationsRoute = createRoute(() => ({
  path: '/api/apm/services/{serviceName}/annotations',
  params: {
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([
      rangeRt,
      t.partial({
        environment: t.string
      })
    ])
  },
  handler: async ({ context, request }) => {
    const setup = await setupRequest(context, request);
    const { serviceName } = context.params.path;
    const { environment } = context.params.query;

    return getServiceAnnotations({
      setup,
      serviceName,
      environment
    });
  }
}));
