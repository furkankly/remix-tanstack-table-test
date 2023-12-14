import { faker } from "@faker-js/faker";
import { mockData } from "./root";

export type Person = {
  id: string;
  name: string;
  surname: string;
  age: number;
};

const newPerson = (): Person => ({
  id: faker.database.mongodbObjectId(),
  name: faker.person.firstName(),
  surname: faker.person.lastName(),
  age: faker.number.int(40),
});

export function makeData(len: number) {
  const data: Person[] = [];
  return [...Array(len)].reduce(() => {
    data.push(newPerson());
    return data;
  }, data);
}

// emulate data fetching
export async function fetchData({
  pageSize,
  pageIndex,
}: {
  pageSize: string;
  pageIndex: string;
}): Promise<{ data: Person[]; size: number }> {
  const paginatedData = (mockData as Person[]).slice(
    parseInt(pageIndex),
    parseInt(pageIndex) + parseInt(pageSize)
  );

  return new Promise((resolve) => {
    setTimeout(async () => {
      resolve({
        data: paginatedData,
        size: (mockData as Person[]).length,
      });
    }, 2000);
  });
}
