import chalk from "chalk";

export default {
  name: "error",

  run: async (error: string) => {
    console.log(chalk.red.bold(`[ERROR] ${error}`));
  },
}
