import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

export const UserRouting = ({ dictionary, locale }) => (
  <SubMenu label={dictionary['navigation'].user} icon={<i className='ri-user-line' />}>
    <MenuItem href={`/${locale}/user/list`}>{dictionary['navigation'].list}</MenuItem>
    <MenuItem href={`/${locale}/user/view`}>{dictionary['navigation'].view}</MenuItem>
  </SubMenu>
)
