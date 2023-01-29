import { build, fake } from "test-data-bot"

export const taskBuilder = ({ expense }) =>
  build("Task").fields({
    name: fake(f => f.lorem.words()),
    description: fake(f => f.lorem.words()),
    label: fake(f => f.lorem.words())
  });
