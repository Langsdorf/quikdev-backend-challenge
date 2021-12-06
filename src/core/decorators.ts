import "reflect-metadata";
import { verifyAuthentication } from "src/middlewares/verify-authentication.middleware";

interface RouteObject {
  key: string;
  path: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  handler: Function;
  attributes: Record<string, any>;
}

let routes: RouteObject[] = [];

export const getRoutesObject = (): RouteObject[] => routes;
export const clearRoutes = (): RouteObject[] => (routes = []);

/**
 *
 * Decorator para definir as rotas
 *
 * @param path string Caminho da rota
 * @param method string Método da rota (GET, POST, PUT, DELETE, PATCH)
 * @returns Function
 */
const methodDecoratorFunction = (
  path: string = "/",
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH"
) => {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    let handler = descriptor.value!;

    descriptor.value = function (...args) {
      let existingParameters: {
        parameterIndex: number;
        type: string;
      }[] = Reflect.getOwnMetadata(propertyKey, target, propertyKey) || [];

      /**
       * Organiza a ordem dos parâmetros da rota
       */
      existingParameters = existingParameters.sort(
        (a, b) => a.parameterIndex - b.parameterIndex
      );

      const newArgs = [];

      /**
       * Substitui os parâmetros da rota pelos valores passados
       */
      if (existingParameters) {
        for (let { type } of existingParameters) {
          for (let { parameter, type: realParameterType } of args) {
            if (realParameterType !== type) continue;
            newArgs.push(parameter);
          }
        }
      }

      /**
       * Retorna o método pronto para uso
       */
      return handler.apply(this, newArgs);
    };

    const formatPath = path.indexOf("/") === 0 ? path : `/${path}`;

    routes.push({
      key: propertyKey,
      path: `${path ? formatPath : "/"}`,
      method,
      handler: descriptor.value,
      attributes:
        Reflect.getOwnMetadata("attributes", target, propertyKey) || {},
    });

    return descriptor;
  };
};

/**
 * Decorator para os parâmetros da rota
 *
 * @param type string Tipo de parâmetro (request, response, body, params, next)
 * @returns Function
 */
const paramDecoratorFunction = (type: string) => {
  return function (
    target: Object,
    propertyKey: string,
    parameterIndex: number
  ) {
    let existingParameters: {
      parameterIndex: number;
      type: string;
    }[] = Reflect.getOwnMetadata(propertyKey, target, propertyKey) || [];

    existingParameters.push({
      parameterIndex,
      type,
    });

    Reflect.defineMetadata(
      propertyKey,
      existingParameters,
      target,
      propertyKey
    );
  };
};

/**
 * Decorator para definir o atributos de proteção da rota
 *
 * @returns Function
 */
const protectedRoute = () => {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const attributes =
      Reflect.getOwnMetadata("attributes", target, propertyKey) || {};

    Reflect.defineMetadata(
      "attributes",
      { ...attributes, protected: true },
      target,
      propertyKey
    );

    return descriptor;
  };
};

/**
 * Criação dos decorators para definir as rotas
 */

export const GET = (path: string = "/") => methodDecoratorFunction(path, "GET");
export const POST = (path: string = "/") =>
  methodDecoratorFunction(path, "POST");
export const DELETE = (path: string = "/") =>
  methodDecoratorFunction(path, "DELETE");
export const PUT = (path: string = "/") => methodDecoratorFunction(path, "PUT");
export const PATCH = (path: string = "/") =>
  methodDecoratorFunction(path, "PATCH");

/**
 * Criação dos decorators para definir os parâmetros da rota
 */

export const Body = () => paramDecoratorFunction("body");
export const Request = () => paramDecoratorFunction("request");
export const Response = () => paramDecoratorFunction("response");
export const Next = () => paramDecoratorFunction("next");
export const Params = () => paramDecoratorFunction("params");

/**
 * Criação dos decorators para definir os atributos da rota
 */

export const Protected = () => protectedRoute();
