import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

export const TestRouting = ({ dictionary, locale }) => (
  <SubMenu label={dictionary['navigation'].test} icon={<i className='ri-user-line' />}>
    <MenuItem href={`/${locale}/test/list`}>{dictionary['navigation'].list}</MenuItem>
    <MenuItem href={`/${locale}/test/view`}>{dictionary['navigation'].questions}</MenuItem>
  </SubMenu>
)
