import { z } from "@hono/zod-openapi";

export const CommonModelSchema = z.object({
  id: z.string().openapi({
    example: "1234567890abcdef",
    description: "The ID of the model",
  }),
  created_at: z.string().openapi({
    example: "2025-01-01T00:00:00.000Z",
    description: "The creation time of the model",
  }),
  updated_at: z.string().openapi({
    example: "2025-01-01T00:00:00.000Z",
    description: "The update time of the model",
  }),
  deleted_at: z.string().openapi({
    example: "2025-01-01T00:00:00.000Z",
    description: "The deletion time of the model",
  }),
});

export const OmitCommonFields = {
  created_at: true,
  updated_at: true,
  deleted_at: true,
  id: true,
} as const;

export const CommonFileSchema = z.object({
  file: z.any().openapi({
    type: "string",
    format: "binary",
    example: "data:application/octet-stream;base64,...",
    description: "待上传的二进制文件",
  }),
});

// 通用分页请求和响应 schema
export const CommonPaginationRequestSchema = z.object({
  page: z.coerce.number().default(1).openapi({
    example: 1,
    description: "The page number",
  }),
  page_size: z.coerce.number().default(10).openapi({
    example: 10,
    description: "The page size",
  }),
});

export const CommonPaginationResponseSchema = z.object({
  total: z.number().openapi({
    example: 100,
    description: "The total number of items",
  }),
  page: z.number().openapi({
    example: 1,
    description: "The page number",
  }),
  page_size: z.number().openapi({
    example: 10,
    description: "The page size",
  }),
});

export const genPaginationResponseSchema = (dataSchema: z.ZodSchema) => {
  return z.object({
    code: z.number().default(0),
    message: z.string().optional().default(''),
    data:  z.object({
      data: z.array(dataSchema),
      // pagination: CommonPaginationResponseSchema,
      current_page: z.number().openapi({
        example: 1,
        description: "The current page number",
      }),
      total: z.number().openapi({
        example: 10,
        description: "The total number of items",
      }),
      per_page: z.number().openapi({
        example: 10,
        description: "The number of items per page",
      }),
      last_page: z.number().openapi({
        example: 10,
        description: "The last page number",
      }),
      count: z.number().openapi({
        example: 10,
        description: "The total number of items",
      }),
    })
  })
};

// common id schema
export const CommonIdSchema = z.object({
  id: z.string().openapi({
    example: "1234567890abcdef",
    description: "The ID of the model",
  })
})

// common status schema
export const CommonSuccessSchema = z.object({
  success: z.boolean()
}).openapi({
  example: {
    success: true,
  },
  description: "The success of the operation",
})