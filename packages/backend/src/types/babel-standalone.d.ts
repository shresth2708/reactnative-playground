declare module '@babel/standalone' {
  export interface TransformOptions {
    presets?: any[];
    plugins?: any[];
    filename?: string;
    sourceType?: 'script' | 'module' | 'unambiguous';
    [key: string]: any;
  }

  export interface TransformResult {
    code: string | null;
    map: any;
    ast: any;
  }

  export function transform(code: string, options?: TransformOptions): TransformResult;
  export function transformFromAst(ast: any, code?: string, options?: TransformOptions): TransformResult;
}
