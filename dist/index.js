"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const clickUp_router_js_1 = __importDefault(require("./routes/clickUp.router.js"));
const notFoundMiddleware_js_1 = __importDefault(require("./middleware/notFoundMiddleware.js"));
const errorHandlerMiddleware_js_1 = __importDefault(require("./middleware/errorHandlerMiddleware.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use('/api/v1/click-up', clickUp_router_js_1.default);
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('API development');
});
app.use(errorHandlerMiddleware_js_1.default);
app.use(notFoundMiddleware_js_1.default);
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// async function main() {
//   const post = await prisma.post.update({
//     where: { id: 1 },
//     data: { published: true },
//   });
//   console.log(post);
// }
// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
//# sourceMappingURL=index.js.map